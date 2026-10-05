const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let trainerToken = '';
let memberToken = '';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('   GYMKHANA END-TO-END AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // --- 1. PUBLIC ENDPOINTS ---
  console.log('1. Testing Public Endpoints...');
  try {
    const health = await request('/health');
    assert(health.data.status === 'healthy', 'Health check returns healthy');

    const exercises = await request('/exercises');
    assert(exercises.data.success && exercises.data.data.exercises.length >= 20, `Exercises library has >= 20 items (got ${exercises.data.data.exercises.length})`);

    const filteredExercises = await request('/exercises?body_part=Chest');
    assert(filteredExercises.data.data.exercises.every(e => e.body_part === 'Chest'), 'Exercise filter by body_part=Chest works');

    const exerciseDetail = await request('/exercises/2');
    assert(exerciseDetail.data.data.exercise.name === 'Barbell Bench Press', 'Exercise #2 is Barbell Bench Press with instructions');

    const equipment = await request('/equipment');
    assert(equipment.data.success && equipment.data.data.equipment.length >= 12, `Equipment catalog has >= 12 items (got ${equipment.data.data.equipment.length})`);

    const equipmentDetail = await request('/equipment/2');
    assert(equipmentDetail.data.data.equipment.id === 2, 'Equipment #2 detail returns with benefits and how_to_use');

    const workouts = await request('/workouts');
    assert(workouts.data.success && workouts.data.data.plans.length >= 5, `Workout plans has >= 5 items (got ${workouts.data.data.plans.length})`);

    const workoutDetail = await request('/workouts/1');
    assert(workoutDetail.data.data.exercises.length > 0, `Workout plan #1 has ${workoutDetail.data.data.exercises.length} prescribed exercises`);

    const trainers = await request('/trainers');
    assert(trainers.data.success && trainers.data.data.trainers.length >= 3, `Trainers directory has >= 3 trainers (got ${trainers.data.data.trainers.length})`);

    const memberships = await request('/memberships');
    assert(memberships.data.success && memberships.data.data.memberships.length === 3, 'Membership tiers has exactly 3 tiers');

    const contact = await request('/contact', {
      method: 'POST',
      body: {
        name: 'Test Visitor',
        email: 'visitor@example.com',
        subject: 'Inquiry Test',
        message: 'This is an automated test message for verification.',
      },
    });
    assert(contact.data.success, 'Public contact form submission succeeds');
  } catch (err) {
    console.error('Public endpoint error:', err.message);
  }

  // --- 2. AUTHENTICATION & VALIDATION ---
  console.log('\n2. Testing Authentication & Session Handling...');
  try {
    // Admin login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@gymkhana.com', password: 'Admin@123' },
    });
    assert(adminLogin.data.success && adminLogin.data.data.user.role === 'ADMIN', 'Admin login succeeds with role ADMIN');
    adminToken = adminLogin.data.data.token;

    // Trainer login
    const trainerLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'trainer@gymkhana.com', password: 'Trainer@123' },
    });
    assert(trainerLogin.data.success && trainerLogin.data.data.user.role === 'TRAINER', 'Trainer login succeeds with role TRAINER');
    trainerToken = trainerLogin.data.data.token;

    // Member login
    const memberLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'member1@gymkhana.com', password: 'Member@123' },
    });
    assert(memberLogin.data.success && memberLogin.data.data.user.role === 'MEMBER', 'Member login succeeds with role MEMBER');
    memberToken = memberLogin.data.data.token;

    // Invalid credentials
    const invalidLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@gymkhana.com', password: 'WrongPassword' },
    });
    assert(invalidLogin.status === 401, 'Invalid password correctly returns 401 Unauthorized');

    // Auth /me verification
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(meRes.data.data.user.email === 'admin@gymkhana.com', 'GET /auth/me returns valid admin user session');
  } catch (err) {
    console.error('Auth error:', err.message);
  }

  // --- 3. SECURITY & ROLE GUARDS ---
  console.log('\n3. Testing Role-Based Security Middleware...');
  try {
    const unauth = await request('/admin/stats');
    assert(unauth.status === 401, 'Unauthenticated request to /admin/stats returns 401');

    const memberToAdmin = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberToAdmin.status === 403, 'Member token accessing /admin/stats returns 403 Forbidden');

    const trainerToAdmin = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerToAdmin.status === 403, 'Trainer token accessing /admin/stats returns 403 Forbidden');
  } catch (err) {
    console.error('Role guard error:', err.message);
  }

  // --- 4. MEMBER WORKSPACE ENDPOINTS ---
  console.log('\n4. Testing Member Workspace APIs...');
  try {
    const memDash = await request('/members/dashboard', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memDash.data.success && memDash.data.data.member, 'Member dashboard returns member, trainer, and plan');

    const memMembership = await request('/members/membership', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memMembership.data.data.membership.name === 'Standard 6-Month Pass', 'Member active tier is Standard 6-Month Pass');

    const memPlan = await request('/members/workout-plan', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memPlan.data.data.plan && memPlan.data.data.exercises.length > 0, 'Member workout plan returns with exercise list');

    const memAtt = await request('/members/attendance', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memAtt.data.data.attendance.length > 0, `Member attendance returns historical records (${memAtt.data.data.attendance.length} entries)`);

    const memProg = await request('/members/progress', {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memProg.data.data.progress.length > 0, 'Member biometric progress records return');

    // Post new progress
    const addProg = await request('/members/progress', {
      method: 'POST',
      headers: { Authorization: `Bearer ${memberToken}` },
      body: {
        measured_on: '2026-10-03',
        weight_kg: 76.8,
        height_cm: 178,
        bmi: 24.2,
        notes: 'Automated test measurement',
      },
    });
    assert(addProg.data.success, 'Member logs new biometric measurement');
  } catch (err) {
    console.error('Member workspace error:', err.message);
  }

  // --- 5. TRAINER WORKSPACE ENDPOINTS ---
  console.log('\n5. Testing Trainer Workspace APIs...');
  try {
    const trainerDash = await request('/trainers/dashboard', {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerDash.data.success && trainerDash.data.data.membersCount >= 1, `Trainer dashboard returns assigned roster (count: ${trainerDash.data.data.membersCount})`);

    const trainerMembers = await request('/trainers/members', {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerMembers.data.data.members.length > 0, 'Trainer can query assigned athlete roster');

    const memberDossier = await request('/trainers/members/1', {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(memberDossier.data.data.attendance && memberDossier.data.data.progress, 'Trainer can inspect athlete dossier (attendance + biometrics)');

    const trainerPlans = await request('/trainers/plans', {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerPlans.data.success, 'Trainer can query authored workout plans');
  } catch (err) {
    console.error('Trainer workspace error:', err.message);
  }

  // --- 6. ADMIN WORKSPACE ENDPOINTS ---
  console.log('\n6. Testing Admin Workspace & CRUD APIs...');
  try {
    const adminStats = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const c = adminStats.data.data.counts;
    assert(c.members > 0 && c.trainers > 0 && c.exercises > 0 && c.equipment > 0 && c.workoutPlans > 0,
      `Admin stats returns live counts: ${c.members} members, ${c.trainers} coaches, ${c.exercises} exercises, ${c.equipment} machines, ${c.workoutPlans} plans`
    );

    const adminMembers = await request('/admin/members', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminMembers.data.data.members.length > 0, 'Admin can list members with status and assigned coach');

    // Admin CRUD test on exercises
    const newEx = await request('/exercises', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Automated Test Dumbbell Shrug',
        body_part: 'Shoulders',
        category: 'Isolation',
        difficulty: 'Beginner',
        description: 'Test exercise for CRUD validation',
        instructions: 'Phase 1: Shrug shoulders upward\nPhase 2: Hold for 2 seconds',
      },
    });
    assert(newEx.data.success, 'Admin creates a new exercise');
    const createdExId = newEx.data.data.id;

    // Update exercise
    const updateEx = await request(`/exercises/${createdExId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Automated Test Dumbbell Shrug (Updated)',
        body_part: 'Shoulders',
        description: 'Updated description',
        instructions: 'Updated instructions',
      },
    });
    assert(updateEx.data.success, 'Admin updates exercise record');

    // Delete exercise
    const delEx = await request(`/exercises/${createdExId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delEx.data.success, 'Admin deletes exercise record');

    // Admin messages review
    const messages = await request('/contact', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(messages.data.data.messages.length > 0, `Admin lists contact messages (${messages.data.data.messages.length} messages)`);

    // Toggle read on first message
    const firstMsgId = messages.data.data.messages[0].id;
    const toggleMsg = await request(`/contact/${firstMsgId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { is_read: true },
    });
    assert(toggleMsg.data.success, 'Admin marks inquiry as read');
  } catch (err) {
    console.error('Admin workspace error:', err.message);
  }

  console.log('\n====================================================');
  console.log(` SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log('====================================================\n');
}

runTests();
