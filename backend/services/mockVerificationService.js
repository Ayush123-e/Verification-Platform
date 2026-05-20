const crypto = require('crypto');

/**
 * Service to simulate Aadhaar (UIDAI) Gateway
 */
const verifyAadhaar = async (aadhaarNumber, fullName, dob) => {
  // Simulate network latency (500ms - 1000ms)
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  // Syntactic Validation: Aadhaar must be 12 numeric digits
  const cleanAadhaar = aadhaarNumber.replace(/\s|-/g, '');
  const isNumeric = /^\d{12}$/.test(cleanAadhaar);

  if (!isNumeric) {
    return {
      status: 'failed',
      referenceId: null,
      message: 'Invalid Aadhaar format. Must be a 12-digit numeric code.',
      extractedData: null
    };
  }

  // Check mock behavior
  // Simulating a failed result for specific test numbers
  if (cleanAadhaar.startsWith('0000')) {
    return {
      status: 'failed',
      referenceId: crypto.randomBytes(8).toString('hex').toUpperCase(),
      message: 'Aadhaar Card does not exist / Authentication failed.',
      extractedData: null
    };
  }

  // Name & DOB matching (case-insensitive, basic normalization)
  const candidateNameNormalized = fullName.trim().toLowerCase();
  
  // Custom mock database to simulate partial mismatches or matching data
  let mockName = fullName; // Defaults to matching
  let nameMatch = true;
  let dobMatch = true;

  // Simulate a partial mismatch or warning if Aadhaar ends with '9'
  if (cleanAadhaar.endsWith('9')) {
    mockName = fullName + ' Prasad'; // simulated slight typo on government records
    nameMatch = false;
  }

  return {
    status: 'success',
    referenceId: 'UIDAI-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    verifiedAt: new Date(),
    message: 'Aadhaar biometric & demographic verification successful.',
    extractedData: {
      nameMatch,
      dobMatch,
      gender: candidateNameNormalized.includes('devi') || candidateNameNormalized.includes('kumari') || candidateNameNormalized.includes('shrut') ? 'Female' : 'Male',
      address: '102, Silver Crest Apartments, Sector 15, Dwarka, New Delhi - 110075'
    }
  };
};

/**
 * Service to simulate PAN (Income Tax Dept / NSDL) Gateway
 */
const verifyPAN = async (panNumber, fullName, dob) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

  // Syntactic Validation: Standard PAN regex (5 Letters, 4 Numbers, 1 Letter)
  const cleanPAN = panNumber.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(cleanPAN)) {
    return {
      status: 'failed',
      referenceId: null,
      message: 'Invalid PAN card format. Standard format is XXXXX1234X.',
      extractedData: null
    };
  }

  // Check mock behavior
  // Simulating a failed result for specific test PANs
  if (cleanPAN.startsWith('ABCDE')) {
    return {
      status: 'failed',
      referenceId: crypto.randomBytes(8).toString('hex').toUpperCase(),
      message: 'PAN number not found in Income Tax records.',
      extractedData: null
    };
  }

  // Name matches
  let nameMatch = true;
  let dobMatch = true;

  // Simulate warning/partial mismatch if PAN ends with 'Z'
  if (cleanPAN.endsWith('Z')) {
    nameMatch = false;
  }

  return {
    status: 'success',
    referenceId: 'NSDL-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    verifiedAt: new Date(),
    message: 'PAN status verified active.',
    extractedData: {
      nameMatch,
      dobMatch,
      category: 'Individual',
      panStatus: 'Active'
    }
  };
};

module.exports = {
  verifyAadhaar,
  verifyPAN
};
