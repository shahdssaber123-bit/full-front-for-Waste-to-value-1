// Centralized localStorage-based data simulation
const KEYS = {
  OPERATIONS: 'wtv_operations',
  INVENTORY: 'wtv_inventory',
  NOTIFICATIONS: 'wtv_notifications',
  USERS: 'wtv_users',
  RESERVATIONS: 'wtv_reservations',
  MESSAGES: 'wtv_messages',
  RATINGS: 'wtv_ratings',
  CURRENT_USER: 'wtv_current_user',
};

const STAGES = [
  'Requested',
  'Driver Assigned',
  'Pickup In Progress',
  'Arrived at HUB',
  'QA Inspection',
  'Accepted',
  'Rejected',
  'Sorting',
  'Baling',
  'Stored in Inventory',
  'Reserved by Industry',
  'Outbound Delivery',
  'Completed',
];

const MATERIALS = [
  { name: 'PET Plastic', code: 'PET', unit: 'kg', avgPrice: 0.85 },
  { name: 'HDPE Plastic', code: 'HDPE', unit: 'kg', avgPrice: 0.72 },
  { name: 'Mixed Paper', code: 'PAPER', unit: 'kg', avgPrice: 0.35 },
  { name: 'Cardboard (OCC)', code: 'OCC', unit: 'kg', avgPrice: 0.28 },
  { name: 'Aluminum Cans', code: 'ALU', unit: 'kg', avgPrice: 1.45 },
  { name: 'Steel / Ferrous', code: 'FE', unit: 'kg', avgPrice: 0.38 },
  { name: 'Glass (Clear)', code: 'GLASS-C', unit: 'kg', avgPrice: 0.12 },
  { name: 'Glass (Mixed)', code: 'GLASS-M', unit: 'kg', avgPrice: 0.08 },
  { name: 'E-Waste', code: 'EWASTE', unit: 'kg', avgPrice: 2.10 },
  { name: 'Organic Waste', code: 'ORG', unit: 'kg', avgPrice: 0.05 },
];

const PURITY_GRADES = ['A+ (99%+)', 'A (95-99%)', 'B (90-95%)', 'C (80-90%)', 'D (<80%)'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

function get(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('wtv-data-change', { detail: { key } }));
}

function generateId() {
  return 'OP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function generateBatchId() {
  return 'BAT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();
}

// Initialize seed data if empty
function initSeedData() {
  if (get(KEYS.OPERATIONS)) return;

  const demoUsers = [
    { id: 'u1', name: 'Al-Rashid Recycling Co.', email: 'supplier@demo.com', role: 'supplier', company: 'Al-Rashid Recycling', location: 'Riyadh Industrial Zone', phone: '+966 55 123 4567' },
    { id: 'u2', name: 'Sarah Al-Fahad', email: 'admin@demo.com', role: 'admin', company: 'Waste-to-Value HQ', location: 'Operations Center', phone: '+966 55 234 5678' },
    { id: 'u3', name: 'GreenPack Industries', email: 'industry@demo.com', role: 'industry', company: 'GreenPack Industries', location: 'KAEC Industrial Valley', phone: '+966 55 345 6789', sector: 'Packaging Manufacturing' },
    { id: 'u4', name: 'Omar Al-Mansouri', email: 'driver@demo.com', role: 'driver', company: 'Waste-to-Value Logistics', location: 'Jeddah Fleet Hub', phone: '+966 55 456 7890', vehicle: 'Isuzu NPR 6-Ton', plate: 'ABC-1234', rating: 4.7 },
    { id: 'u5', name: 'EcoPure Plastics', email: 'supplier2@demo.com', role: 'supplier', company: 'EcoPure Plastics', location: 'Dammam Commercial District', phone: '+966 55 567 8901' },
    { id: 'u6', name: 'Khalid Al-Otaibi', email: 'driver2@demo.com', role: 'driver', company: 'Waste-to-Value Logistics', location: 'Riyadh Fleet Hub', phone: '+966 55 678 9012', vehicle: 'MAN TGS 18-Ton', plate: 'XYZ-5678', rating: 4.9 },
    { id: 'u7', name: 'Nora Al-Sulaiman', email: 'hub@demo.com', role: 'hub_manager', company: 'Waste-to-Value Hub — Riyadh', location: 'Riyadh Processing Hub', phone: '+966 55 789 0123' },
  ];

  const now = Date.now();
  const day = 86400000;

  const demoOps = [
    { id: 'OP-A1B2C3', supplierId: 'u1', supplierName: 'Al-Rashid Recycling Co.', material: 'PET Plastic', materialCode: 'PET', estQty: 2500, actualQty: 2380, contamination: 3.2, qaResult: 'Pass', purityGrade: 'A (95-99%)', condition: 'Good', driverId: 'u4', driverName: 'Omar Al-Mansouri', stage: 'Stored in Inventory', location: 'Riyadh Industrial Zone', notes: 'Clean bales, minimal contamination', createdAt: now - 12*day, updatedAt: now - 2*day, pickupDate: new Date(now - 10*day).toISOString().split('T')[0] },
    { id: 'OP-D4E5F6', supplierId: 'u1', supplierName: 'Al-Rashid Recycling Co.', material: 'Mixed Paper', materialCode: 'PAPER', estQty: 1800, actualQty: 1650, contamination: 8.5, qaResult: 'Pass', purityGrade: 'B (90-95%)', condition: 'Fair', driverId: 'u6', driverName: 'Khalid Al-Otaibi', stage: 'Baling', location: 'Riyadh Industrial Zone', notes: 'Some moisture damage', createdAt: now - 8*day, updatedAt: now - 1*day, pickupDate: new Date(now - 6*day).toISOString().split('T')[0] },
    { id: 'OP-G7H8I9', supplierId: 'u5', supplierName: 'EcoPure Plastics', material: 'HDPE Plastic', materialCode: 'HDPE', estQty: 3200, actualQty: 3100, contamination: 1.8, qaResult: 'Pass', purityGrade: 'A+ (99%+)', condition: 'Excellent', driverId: 'u4', driverName: 'Omar Al-Mansouri', stage: 'Completed', location: 'Dammam Commercial District', notes: 'Premium grade, factory-sorted', createdAt: now - 20*day, updatedAt: now - 5*day, pickupDate: new Date(now - 18*day).toISOString().split('T')[0] },
    { id: 'OP-J1K2L3', supplierId: 'u5', supplierName: 'EcoPure Plastics', material: 'Aluminum Cans', materialCode: 'ALU', estQty: 800, actualQty: null, contamination: null, qaResult: null, purityGrade: null, condition: null, driverId: null, driverName: null, stage: 'Requested', location: 'Dammam Commercial District', notes: 'Crushed cans, approximately 800kg', createdAt: now - 1*day, updatedAt: now - 1*day, pickupDate: new Date(now + 2*day).toISOString().split('T')[0] },
    { id: 'OP-M4N5O6', supplierId: 'u1', supplierName: 'Al-Rashid Recycling Co.', material: 'Steel / Ferrous', materialCode: 'FE', estQty: 5000, actualQty: 4850, contamination: 5.0, qaResult: 'Pass', purityGrade: 'B (90-95%)', condition: 'Good', driverId: 'u6', driverName: 'Khalid Al-Otaibi', stage: 'Reserved by Industry', location: 'Riyadh Industrial Zone', notes: 'Mixed ferrous scrap', createdAt: now - 15*day, updatedAt: now - 3*day, pickupDate: new Date(now - 13*day).toISOString().split('T')[0] },
    { id: 'OP-P7Q8R9', supplierId: 'u1', supplierName: 'Al-Rashid Recycling Co.', material: 'Glass (Clear)', materialCode: 'GLASS-C', estQty: 1200, actualQty: null, contamination: null, qaResult: null, purityGrade: null, condition: null, driverId: 'u4', driverName: 'Omar Al-Mansouri', stage: 'Driver Assigned', location: 'Riyadh Industrial Zone', notes: 'Clear glass bottles', createdAt: now - 2*day, updatedAt: now - 1*day, pickupDate: new Date(now + 1*day).toISOString().split('T')[0] },
  ];

  const demoInventory = [
    { id: 'INV-001', batchId: 'BAT-A1X', material: 'PET Plastic', materialCode: 'PET', weight: 2380, purityGrade: 'A (95-99%)', condition: 'Good', processingStage: 'Baled', dateAdded: new Date(now - 2*day).toISOString(), riskDate: new Date(now + 60*day).toISOString(), sourceOp: 'OP-A1B2C3', reserved: false, reservedBy: null },
    { id: 'INV-002', batchId: 'BAT-B2Y', material: 'HDPE Plastic', materialCode: 'HDPE', weight: 3100, purityGrade: 'A+ (99%+)', condition: 'Excellent', processingStage: 'Baled', dateAdded: new Date(now - 5*day).toISOString(), riskDate: new Date(now + 90*day).toISOString(), sourceOp: 'OP-G7H8I9', reserved: false, reservedBy: null },
    { id: 'INV-003', batchId: 'BAT-C3Z', material: 'Steel / Ferrous', materialCode: 'FE', weight: 4850, purityGrade: 'B (90-95%)', condition: 'Good', processingStage: 'Sorted', dateAdded: new Date(now - 3*day).toISOString(), riskDate: new Date(now + 45*day).toISOString(), sourceOp: 'OP-M4N5O6', reserved: true, reservedBy: 'u3' },
    { id: 'INV-004', batchId: 'BAT-D4W', material: 'Cardboard (OCC)', materialCode: 'OCC', weight: 1200, purityGrade: 'B (90-95%)', condition: 'Fair', processingStage: 'Baled', dateAdded: new Date(now - 10*day).toISOString(), riskDate: new Date(now + 15*day).toISOString(), sourceOp: null, reserved: false, reservedBy: null },
    { id: 'INV-005', batchId: 'BAT-E5V', material: 'Aluminum Cans', materialCode: 'ALU', weight: 650, purityGrade: 'A (95-99%)', condition: 'Good', processingStage: 'Crushed', dateAdded: new Date(now - 7*day).toISOString(), riskDate: new Date(now + 120*day).toISOString(), sourceOp: null, reserved: false, reservedBy: null },
  ];

  const demoNotifications = [
    { id: 'n1', userId: 'u2', type: 'new_request', message: 'New pickup request from EcoPure Plastics - Aluminum Cans (800kg)', read: false, createdAt: now - 1*day, opId: 'OP-J1K2L3' },
    { id: 'n2', userId: 'u1', type: 'status_update', message: 'Operation OP-D4E5F6 moved to Baling stage', read: false, createdAt: now - 1*day, opId: 'OP-D4E5F6' },
    { id: 'n3', userId: 'u4', type: 'assignment', message: 'New pickup assigned: Glass (Clear) from Al-Rashid Recycling - OP-P7Q8R9', read: false, createdAt: now - 1*day, opId: 'OP-P7Q8R9' },
    { id: 'n4', userId: 'u3', type: 'reservation', message: 'Your reservation for Steel/Ferrous (4850kg) has been confirmed', read: true, createdAt: now - 3*day, opId: 'OP-M4N5O6' },
  ];

  const demoReservations = [
    { id: 'RES-001', industryId: 'u3', industryName: 'GreenPack Industries', inventoryId: 'INV-003', material: 'Steel / Ferrous', quantity: 4850, status: 'Confirmed', meetingDate: new Date(now + 5*day).toISOString().split('T')[0], notes: 'For Q2 production run', createdAt: now - 3*day, companyDetails: 'GreenPack Industries - Packaging Manufacturing' },
  ];

  const demoRatings = [
    { id: 'r1', driverId: 'u4', supplierId: 'u5', opId: 'OP-G7H8I9', rating: 5, comment: 'Excellent service, very professional', createdAt: now - 5*day },
  ];

  set(KEYS.USERS, demoUsers);
  set(KEYS.OPERATIONS, demoOps);
  set(KEYS.INVENTORY, demoInventory);
  set(KEYS.NOTIFICATIONS, demoNotifications);
  set(KEYS.RESERVATIONS, demoReservations);
  set(KEYS.RATINGS, demoRatings);
  set(KEYS.MESSAGES, []);
}

// CRUD Operations
function getOperations() { return get(KEYS.OPERATIONS) || []; }
function getInventory() { return get(KEYS.INVENTORY) || []; }
function getNotifications(userId) { return (get(KEYS.NOTIFICATIONS) || []).filter(n => n.userId === userId); }
function getAllNotifications() { return get(KEYS.NOTIFICATIONS) || []; }
function getUsers() { return get(KEYS.USERS) || []; }
function getReservations() { return get(KEYS.RESERVATIONS) || []; }
function getRatings() { return get(KEYS.RATINGS) || []; }
function getMessages() { return get(KEYS.MESSAGES) || []; }

function getCurrentUser() { return get(KEYS.CURRENT_USER); }
function setCurrentUser(user) { set(KEYS.CURRENT_USER, user); }
function logout() { localStorage.removeItem(KEYS.CURRENT_USER); }

function addOperation(op) {
  const ops = getOperations();
  const newOp = { ...op, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() };
  ops.push(newOp);
  set(KEYS.OPERATIONS, ops);
  addNotification('u2', 'new_request', `New pickup request from ${op.supplierName} - ${op.material} (${op.estQty}kg)`, newOp.id);
  return newOp;
}

function updateOperation(opId, updates) {
  const ops = getOperations();
  const idx = ops.findIndex(o => o.id === opId);
  if (idx === -1) return null;
  ops[idx] = { ...ops[idx], ...updates, updatedAt: Date.now() };
  set(KEYS.OPERATIONS, ops);

  const op = ops[idx];
  if (updates.stage) {
    if (op.supplierId) addNotification(op.supplierId, 'status_update', `Operation ${opId} moved to "${updates.stage}"`, opId);
    if (op.driverId && ['Driver Assigned', 'Pickup In Progress'].includes(updates.stage)) {
      addNotification(op.driverId, 'assignment', `Mission update for ${opId}: ${updates.stage}`, opId);
    }
  }
  if (updates.driverId) {
    addNotification(updates.driverId, 'assignment', `New pickup assigned: ${op.material} from ${op.supplierName} - ${opId}`, opId);
  }
  return ops[idx];
}

function addInventoryItem(item) {
  const inv = getInventory();
  const newItem = { ...item, id: 'INV-' + String(inv.length + 1).padStart(3, '0'), batchId: generateBatchId(), dateAdded: new Date().toISOString() };
  inv.push(newItem);
  set(KEYS.INVENTORY, inv);
  return newItem;
}

function updateInventoryItem(itemId, updates) {
  const inv = getInventory();
  const idx = inv.findIndex(i => i.id === itemId);
  if (idx === -1) return null;
  inv[idx] = { ...inv[idx], ...updates };
  set(KEYS.INVENTORY, inv);
  return inv[idx];
}

function addNotification(userId, type, message, opId) {
  const notifs = getAllNotifications();
  notifs.unshift({ id: 'n' + Date.now(), userId, type, message, read: false, createdAt: Date.now(), opId });
  set(KEYS.NOTIFICATIONS, notifs);
}

function markNotificationRead(notifId) {
  const notifs = getAllNotifications();
  const idx = notifs.findIndex(n => n.id === notifId);
  if (idx !== -1) { notifs[idx].read = true; set(KEYS.NOTIFICATIONS, notifs); }
}

function markAllNotificationsRead(userId) {
  const notifs = getAllNotifications();
  notifs.forEach(n => { if (n.userId === userId) n.read = true; });
  set(KEYS.NOTIFICATIONS, notifs);
}

function addReservation(res) {
  const reservations = getReservations();
  const newRes = { ...res, id: 'RES-' + String(reservations.length + 1).padStart(3, '0'), createdAt: Date.now() };
  reservations.push(newRes);
  set(KEYS.RESERVATIONS, reservations);
  addNotification('u2', 'reservation', `New reservation from ${res.industryName} for ${res.material} (${res.quantity}kg)`, null);
  return newRes;
}

function updateReservation(resId, updates) {
  const reservations = getReservations();
  const idx = reservations.findIndex(r => r.id === resId);
  if (idx === -1) return null;
  reservations[idx] = { ...reservations[idx], ...updates };
  set(KEYS.RESERVATIONS, reservations);
  return reservations[idx];
}

function addRating(rating) {
  const ratings = getRatings();
  const newRating = { ...rating, id: 'r' + Date.now(), createdAt: Date.now() };
  ratings.push(newRating);
  set(KEYS.RATINGS, ratings);
  return newRating;
}

function addMessage(msg) {
  const msgs = getMessages();
  msgs.push({ ...msg, id: 'm' + Date.now(), createdAt: Date.now() });
  set(KEYS.MESSAGES, msgs);
}

function loginUser(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) { setCurrentUser(user); return user; }
  return null;
}

function signupUser(userData) {
  const users = getUsers();
  const newUser = { ...userData, id: 'u' + (users.length + 1) };
  users.push(newUser);
  set(KEYS.USERS, users);
  setCurrentUser(newUser);
  return newUser;
}

export const dataStore = {
  init: initSeedData,
  STAGES,
  MATERIALS,
  PURITY_GRADES,
  CONDITIONS,
  getOperations,
  getInventory,
  getNotifications,
  getAllNotifications,
  getUsers,
  getReservations,
  getRatings,
  getMessages,
  getCurrentUser,
  setCurrentUser,
  logout,
  addOperation,
  updateOperation,
  addInventoryItem,
  updateInventoryItem,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  addReservation,
  updateReservation,
  addRating,
  addMessage,
  loginUser,
  signupUser,
};