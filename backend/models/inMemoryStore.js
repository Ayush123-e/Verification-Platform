const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const testPasswordHash = bcrypt.hashSync('password', 10);

const testUser = {
  _id: 'test-user-id-12345',
  name: 'Test Admin',
  email: 'test@example.com',
  password: testPasswordHash,
  company: 'Test Corp',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockCandidates = [
  {
    _id: 'candidate-id-1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    dob: new Date('1995-08-15'),
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    createdBy: 'test-user-id-12345',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    _id: 'candidate-id-2',
    fullName: 'Priya Patel',
    email: 'priya.patel@example.com',
    dob: new Date('1998-11-23'),
    aadhaarNumber: '987654321098',
    panNumber: 'XYZWR9876A',
    createdBy: 'test-user-id-12345',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: 'candidate-id-3',
    fullName: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    dob: new Date('1992-04-02'),
    aadhaarNumber: '111122223333',
    panNumber: 'JKLMN4567P',
    createdBy: 'test-user-id-12345',
    status: 'failed',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5), // 5 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 5)
  }
];

const mockVerifications = [
  {
    _id: 'verification-id-1',
    candidateId: 'candidate-id-1',
    aadhaarStatus: 'verified',
    aadhaarReferenceId: 'UIDAI-MOCK-857219',
    aadhaarMessage: 'Aadhaar details verified successfully',
    aadhaarExtracted: { fullName: 'Aarav Sharma', dob: '1995-08-15' },
    panStatus: 'verified',
    panReferenceId: 'NSDL-MOCK-948102',
    panMessage: 'PAN card verified successfully',
    panExtracted: { fullName: 'AARAV SHARMA', dob: '1995-08-15' },
    verificationDate: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    _id: 'verification-id-3',
    candidateId: 'candidate-id-3',
    aadhaarStatus: 'verified',
    aadhaarReferenceId: 'UIDAI-MOCK-192847',
    aadhaarMessage: 'Aadhaar details verified successfully',
    aadhaarExtracted: { fullName: 'Rohan Verma', dob: '1992-04-02' },
    panStatus: 'rejected',
    panReferenceId: 'NSDL-MOCK-ERR-049',
    panMessage: 'PAN validation failed: Name mismatch',
    panExtracted: null,
    verificationDate: new Date(Date.now() - 3600000 * 24 * 5)
  }
];

// Simple global in-memory database
const db = {
  users: [testUser],
  candidates: mockCandidates,
  verifications: mockVerifications
};

// Helper to check if query matches item
function matches(item, query) {
  if (!query) return true;
  for (const key in query) {
    const queryValue = query[key];
    
    // Handle mongoose ID object compared to string
    const itemValue = item[key] ? String(item[key]) : undefined;
    const matchValue = queryValue ? String(queryValue) : undefined;
    
    if (queryValue && typeof queryValue === 'object') {
      if (queryValue.$in) {
        const stringIn = queryValue.$in.map(val => String(val));
        if (!stringIn.includes(itemValue)) {
          return false;
        }
      } else {
        // Fallback for complex queries
        if (JSON.stringify(item[key]) !== JSON.stringify(queryValue)) {
          return false;
        }
      }
    } else if (itemValue !== matchValue) {
      return false;
    }
  }
  return true;
}

class DocumentInstance {
  constructor(collection, data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = crypto.randomUUID();
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    
    // Hide collection reference from JSON serialization
    Object.defineProperty(this, '_collection', {
      value: collection,
      writable: true,
      enumerable: false
    });
  }

  async save() {
    const list = db[this._collection];
    const idx = list.findIndex(item => String(item._id) === String(this._id));
    this.updatedAt = new Date();
    if (idx >= 0) {
      list[idx] = this;
    } else {
      list.push(this);
    }
    return this;
  }

  async deleteOne() {
    const list = db[this._collection];
    db[this._collection] = list.filter(item => String(item._id) !== String(this._id));
    return { deletedCount: 1 };
  }
}

// User-specific document
class UserDocument extends DocumentInstance {
  constructor(data) {
    super('users', data);
  }

  async comparePassword(candidatePassword) {
    if (this.password && this.password.startsWith('$2')) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
    return candidatePassword === this.password;
  }
}

class CandidateDocument extends DocumentInstance {
  constructor(data) {
    super('candidates', data);
    this.status = this.status || 'pending';
  }
}

class VerificationDocument extends DocumentInstance {
  constructor(data) {
    super('verifications', data);
    this.aadhaarStatus = this.aadhaarStatus || 'pending';
    this.panStatus = this.panStatus || 'pending';
  }
}

const docClasses = {
  users: UserDocument,
  candidates: CandidateDocument,
  verifications: VerificationDocument
};

class MockModel {
  constructor(collection) {
    this.collection = collection;
    this.DocClass = docClasses[collection];
  }

  async find(query) {
    let list = db[this.collection];
    const results = list.filter(item => matches(item, query));
    const docs = results.map(item => new this.DocClass(item));
    
    // Mock Mongoose's chainable .sort()
    docs.sort = (sortQuery) => {
      if (sortQuery && sortQuery.createdAt) {
        const order = sortQuery.createdAt; // -1 or 1
        docs.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)) * (order === -1 ? 1 : -1));
      }
      return docs;
    };
    
    return docs;
  }

  async findOne(query) {
    const list = db[this.collection];
    const item = list.find(item => matches(item, query));
    return item ? new this.DocClass(item) : null;
  }

  async findById(id) {
    const list = db[this.collection];
    const item = list.find(item => String(item._id) === String(id));
    return item ? new this.DocClass(item) : null;
  }

  async create(data) {
    if (this.collection === 'users' && data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const doc = new this.DocClass(data);
    await doc.save();
    return doc;
  }

  async deleteOne(query) {
    const list = db[this.collection];
    const itemsToDelete = list.filter(item => matches(item, query));
    db[this.collection] = list.filter(item => !matches(item, query));
    return { deletedCount: itemsToDelete.length };
  }
}

module.exports = {
  User: new MockModel('users'),
  Candidate: new MockModel('candidates'),
  Verification: new MockModel('verifications'),
  db
};
