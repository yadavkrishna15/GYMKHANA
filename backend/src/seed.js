import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Membership from './models/Membership.js';
import Trainer from './models/Trainer.js';
import Member from './models/Member.js';
import Equipment from './models/Equipment.js';
import Exercise from './models/Exercise.js';
import WorkoutPlan from './models/WorkoutPlan.js';
import Attendance from './models/Attendance.js';
import Progress from './models/Progress.js';
import ContactMessage from './models/ContactMessage.js';
import Counter, { setSequence } from './models/Counter.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/gymkhana_db';

const USERS_DATA = [
  {
    id: 1,
    full_name: 'Administrator',
    email: 'admin@gymkhana.com',
    phone: '+91 98765 00001',
    password_hash: '$2a$10$xJWQc50Wv788/YRet/XO9e7UX4n8lMLAaex/uYB3Tb4NMWkg0FHuK', // Admin@123
    role: 'ADMIN',
  },
  {
    id: 2,
    full_name: 'Coach Vikram Malhotra',
    email: 'trainer@gymkhana.com',
    phone: '+91 98765 00002',
    password_hash: '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', // Trainer@123
    role: 'TRAINER',
  },
  {
    id: 3,
    full_name: 'Coach Ananya Roy',
    email: 'ananya.trainer@gymkhana.com',
    phone: '+91 98765 00003',
    password_hash: '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', // Trainer@123
    role: 'TRAINER',
  },
  {
    id: 4,
    full_name: 'Coach Kabir Singh',
    email: 'kabir.trainer@gymkhana.com',
    phone: '+91 98765 00004',
    password_hash: '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', // Trainer@123
    role: 'TRAINER',
  },
  {
    id: 5,
    full_name: 'Rahul Sharma',
    email: 'member1@gymkhana.com',
    phone: '+91 98765 11111',
    password_hash: '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', // Member@123
    role: 'MEMBER',
  },
  {
    id: 6,
    full_name: 'Priya Verma',
    email: 'member2@gymkhana.com',
    phone: '+91 98765 22222',
    password_hash: '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', // Member@123
    role: 'MEMBER',
  },
  {
    id: 7,
    full_name: 'Amit Kumar',
    email: 'member3@gymkhana.com',
    phone: '+91 98765 33333',
    password_hash: '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', // Member@123
    role: 'MEMBER',
  },
];

const MEMBERSHIPS_DATA = [
  {
    id: 1,
    name: 'Basic Monthly Pass',
    duration_months: 1,
    price: 1500.0,
    features:
      'Full floor gym floor access\nStandard locker room & shower access\nGeneral fitness orientation tour\nWater dispenser & towel service',
    access_details:
      'Floor access Monday to Saturday 06:00 to 22:00. Peak and off-peak hours unrestricted.',
  },
  {
    id: 2,
    name: 'Standard 6-Month Pass',
    duration_months: 6,
    price: 7500.0,
    features:
      'Full floor gym floor & free weights area\n1 Complimentary trainer consultation session\nMonthly biometric body composition scan\nAccess to all periodized public training plans\nPriority locker facilities',
    access_details:
      'Unlimited 7-day facility access Monday through Sunday with full equipment privileges.',
  },
  {
    id: 3,
    name: 'Elite Annual Athletic Pass',
    duration_months: 12,
    price: 13500.0,
    features:
      'Full 365-day unrestricted facility access\nDedicated floor coach assignment\nBi-weekly biometric progress check-ins\nTailored workout plan structuring\nFree guest passes (2 per quarter)\nSauna & recovery zone access',
    access_details:
      'Complete facility access with dedicated locker storage and priority coaching attention.',
  },
];

const TRAINERS_DATA = [
  {
    id: 1,
    user_id: 2,
    specialization: 'Strength & Conditioning',
    experience_years: 8,
    bio: 'Coach Vikram specializes in progressive overload mechanics, Olympic weightlifting foundations, and sport-specific physical preparation.',
    certifications: 'CSCS (NSCA), USA Weightlifting Level 2, CPR/AED',
    availability_status: 'Available',
  },
  {
    id: 2,
    user_id: 3,
    specialization: 'Hypertrophy & Biomechanics',
    experience_years: 5,
    bio: 'Coach Ananya focuses on muscular hypertrophy, structural posture alignment, and safe execution cues for natural physique development.',
    certifications: 'ACSM-CPT, Precision Nutrition Level 1, FMS Level 1',
    availability_status: 'Available',
  },
  {
    id: 3,
    user_id: 4,
    specialization: 'Mobility & Powerlifting',
    experience_years: 6,
    bio: 'Coach Kabir is a dedicated powerlifting technician focusing on heavy compound barbell mechanics, hip mobility, and injury resilience.',
    certifications: 'NSCA-CPT, Westside Barbell Special Strengths Coach',
    availability_status: 'Available',
  },
];

const MEMBERS_DATA = [
  { id: 1, user_id: 5, membership_id: 2, trainer_id: 1, join_date: '2026-01-10', status: 'ACTIVE' },
  { id: 2, user_id: 6, membership_id: 3, trainer_id: 2, join_date: '2026-01-15', status: 'ACTIVE' },
  { id: 3, user_id: 7, membership_id: 1, trainer_id: null, join_date: '2026-02-01', status: 'ACTIVE' },
];

const EQUIPMENT_DATA = [
  {
    id: 1,
    name: 'Olympic Barbell & Power Rack Station',
    category: 'Free Weights / Benches',
    target_body_part: 'Full Body',
    description: 'Heavy-duty steel rack with adjustable J-hooks, knurled safety spotter arms, and standardized 20kg Olympic barbells.',
    primary_purpose: 'Foundation compound movements: Squats, Bench Press, and Overhead Press',
    benefits: 'Enables high-load multi-joint compound lifting with full self-spotting capability.\nAccommodates all human anthropometries through precision pin holes.\nDevelops structural bone density and functional kinetic power.',
    how_to_use: 'Step 1: Adjust J-hooks to armpit height.\nStep 2: Set safety spotter arms just below the bottom range of your movement.\nStep 3: Load Olympic plates evenly on both sleeves and lock with barbell collars.\nStep 4: Unrack with an active core, perform prescribed repetitions, and re-rack under control.',
    safety_instructions: 'Never train heavy compound lifts without securing weight collars on both sides.\nAlways adjust safety arms before loading weights.\nDo not bounce the bar off safety rails.',
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Adjustable Dual Cable Crossover',
    category: 'Cable Station',
    target_body_part: 'Full Body',
    description: 'Twin multi-directional adjustable pulley towers with smooth aluminum bearings and standardized weight stacks.',
    primary_purpose: 'Constant-tension muscular isolation across arbitrary planes of motion',
    benefits: 'Delivers uniform tension through both eccentric and concentric phases.\nDual pulleys permit bilateral chest flyes, cable rows, face pulls, and tricep pressdowns.\nMinimal shear force on joints compared to fixed levers.',
    how_to_use: 'Step 1: Release the spring-loaded carriage pin and slide the pulley to target height.\nStep 2: Attach selected handle attachment (D-handle, rope, straight bar).\nStep 3: Insert weight selector pin firmly into the desired plate increment.\nStep 4: Step out into tension with a staggered athletic stance.',
    safety_instructions: 'Always verify the carriage locking pin has fully clicked into the vertical column hole.\nDo not let weight stacks slam together at the completion of repetitions.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: '45-Degree Plate-Loaded Leg Press',
    category: 'Plate-Loaded Machine',
    target_body_part: 'Legs',
    description: 'Heavy commercial linear leg press carriage riding on hardened steel guide rods with triple lockout positions.',
    primary_purpose: 'High-load quadriceps, hamstring, and gluteal hypertrophy with spinal unloading',
    benefits: 'Allows maximal lower body loading without axial spinal compression.\nMultiple foot placement variations isolate quad sweep or posterior chain.\nBuilt-in secondary safety catches prevent carriage overrun.',
    how_to_use: 'Step 1: Sit firmly into seat with lower back and sacrum pressed flat against back pad.\nStep 2: Place feet shoulder-width on footplate.\nStep 3: Press carriage upward slightly to disengage safety lock handles.\nStep 4: Lower carriage under control until knees reach 90 degrees, then drive through midfoot.\nStep 5: Re-engage lockout levers before removing feet.',
    safety_instructions: 'Never lock your knees out forcefully at the top of the movement.\nKeep lower back glued to the back pad throughout execution to prevent pelvic tilting.',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'Seated Lat Pulldown & Low Row Combo',
    category: 'Pin-Selected Machine',
    target_body_part: 'Back',
    description: 'Dual-purpose vertical pull and horizontal cable station equipped with adjustable thigh hold-down rollers.',
    primary_purpose: 'Latissimus dorsi and scapular retractor muscular development',
    benefits: 'Reinforces vertical pulling mechanics for trainees building up to bodyweight pull-ups.\nQuick-adjust thigh pads ensure athlete stability during heavy working sets.',
    how_to_use: 'Step 1: Adjust thigh pad so thighs fit securely with feet flat on the floor.\nStep 2: Select desired weight on stack.\nStep 3: Grasp wide bar with overhand grip.\nStep 4: Pull bar smoothly to upper clavicle while depressing scapulae.\nStep 5: Control the return to full overhead stretch.',
    safety_instructions: 'Avoid swinging torso backward to jerk momentum into the weight.\nDo not pull the bar behind the neck to protect cervical vertebrae.',
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    name: 'Seated Leg Extension Machine',
    category: 'Pin-Selected Machine',
    target_body_part: 'Legs',
    description: 'Precision cam-driven knee extension station designed to isolate the quadriceps femoris.',
    primary_purpose: 'Quadriceps isolation and patellar tendon conditioning',
    benefits: 'Direct rectus femoris and vastus lateralis stimulation.\nAdjustable backrest and tibia roller pad accommodate varying limb lengths.',
    how_to_use: 'Step 1: Align knee joint pivot axis directly with machine cam rotational axis.\nStep 2: Adjust shin pad to sit right above the ankle joint.\nStep 3: Extend knees until legs are parallel to floor, pausing momentarily at peak contraction.\nStep 4: Lower weight stack smoothly in 2-3 seconds.',
    safety_instructions: 'Do not kick or propel weight with momentum.\nAvoid hyper-extending the knee joint forcefully.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    name: 'Prone Leg Curl Machine',
    category: 'Pin-Selected Machine',
    target_body_part: 'Legs',
    description: 'Ergonomically contoured prone bench providing targeted knee flexion for hamstring isolation.',
    primary_purpose: 'Knee flexor hamstring isolation without lumbar strain',
    benefits: 'Direct stimulation of biceps femoris, semitendinosus, and semimembranosus.\nAngled prone pad places pelvis in optimal anterior tilt.',
    how_to_use: 'Step 1: Lie face down and position Achilles tendons beneath the roller pad.\nStep 2: Grasp forward stabilization handles.\nStep 3: Curl heels toward glutes in a controlled arc.\nStep 4: Pause briefly at peak knee flexion, then lower with control.',
    safety_instructions: 'Do not lift hips off the bench while curling weight upward.\nMaintain neutral foot alignment without excessive toe pointing.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 7,
    name: 'Seated Chest Press Station',
    category: 'Pin-Selected Machine',
    target_body_part: 'Chest',
    description: 'Converging-axis chest press machine with foot-assisted start pedal and multi-grip handles.',
    primary_purpose: 'Pectoralis major and anterior deltoid hypertrophy with fixed trajectory',
    benefits: 'Converging motion mimics natural human dumbbell pressing path.\nIntegrated foot lever allows smooth unracking and re-racking of heavy weights.',
    how_to_use: 'Step 1: Adjust seat height so handles align with mid-chest level.\nStep 2: Press foot pedal to bring handles forward into starting grip position.\nStep 3: Push handles forward while retracting shoulder blades against the pad.\nStep 4: Return slowly until chest feels an active stretch, then press.',
    safety_instructions: 'Keep wrists neutral and aligned with forearms.\nDo not round shoulders forward off the backrest at lockout.',
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 8,
    name: 'Dumbbell Free Weight Complex (2.5kg - 50kg)',
    category: 'Free Weights / Benches',
    target_body_part: 'Full Body',
    description: 'Commercial urethane-encased solid steel dumbbells arranged chronologically on heavy-duty tiered saddles.',
    primary_purpose: 'Unilateral balance, joint stabilizer recruitment, and multi-planar movements',
    benefits: 'Corrects muscular asymmetries between left and right limbs.\nEnables natural rotational mechanics for wrists, elbows, and shoulders.\nUniversal versatility across presses, rows, lunges, and curls.',
    how_to_use: 'Step 1: Choose matching pair corresponding to prescribed resistance.\nStep 2: Lift dumbbells off rack using hip hinge mechanics, never with a rounded spine.\nStep 3: Execute movement through full range of motion under strict tempo.\nStep 4: Return dumbbells to their labeled rack saddle immediately after set completion.',
    safety_instructions: 'Never drop or bounce urethane dumbbells on the gym floor.\nAlways re-rack dumbbells in correct weight order.',
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 9,
    name: 'Seated Cable Row Station',
    category: 'Cable Station',
    target_body_part: 'Back',
    description: 'Low horizontal pulley station with non-slip foot braces and versatile carabiner attachment point.',
    primary_purpose: 'Middle back thickness, rhomboid retraction, and latissimus development',
    benefits: 'Encourages stable horizontal pulling without taxing lower back stability.\nSupports multiple attachments: close-grip V-bar, wide bar, single-arm handles.',
    how_to_use: 'Step 1: Sit on bench, place feet securely on forward foot braces with knees slightly bent.\nStep 2: Grasp handle and sit upright with a braced, neutral spine.\nStep 3: Pull attachment into lower abdomen while pulling shoulder blades back.\nStep 4: Extend arms forward under control to feel full lat stretch.',
    safety_instructions: 'Do not violently rock torso backward and forward during repetitions.\nMaintain slight knee bend to prevent hamstring overstretching.',
    image_url: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 10,
    name: 'Standing Calf Raise Station',
    category: 'Pin-Selected Machine',
    target_body_part: 'Legs',
    description: 'Vertical loading column with contoured shoulder pads and slip-resistant elevated ball-of-foot block.',
    primary_purpose: 'Gastrocnemius and soleus hypertrophy and ankle plantarflexion strength',
    benefits: 'Full plantarflexion and dorsiflexion range of motion over an elevated block.\nPadded shoulder rests eliminate grip fatigue limitations.',
    how_to_use: 'Step 1: Place balls of feet on platform with heels hanging freely.\nStep 2: Position shoulders comfortably under padded levers and stand erect.\nStep 3: Lower heels into deep calf stretch.\nStep 4: Press forcefully through balls of feet to maximum elevation, pausing at top.',
    safety_instructions: 'Do not bounce rapidly at the bottom of the stretch.\nKeep knees slightly soft to avoid hyperextension under vertical loads.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 11,
    name: 'Preacher Curl Arm Station',
    category: 'Free Weights / Benches',
    target_body_part: 'Arms',
    description: 'Contoured 45-degree arm support bench with integrated barbell cradle for bicep isolation.',
    primary_purpose: 'Complete biceps brachii isolation by eliminating shoulder movement and momentum',
    benefits: 'Eliminates cheat mechanics by locking upper arm against high-density foam pad.\nMaximizes tension on the short and long bicep heads.',
    how_to_use: 'Step 1: Adjust seat so armpits rest snugly against top of the angled pad.\nStep 2: Grasp EZ-curl bar with shoulder-width underhand grip.\nStep 3: Curl bar upward toward chin without lifting elbows off pad.\nStep 4: Lower bar under control until arms are almost fully extended.',
    safety_instructions: 'Never abruptly hyperextend elbows at the bottom of the movement.\nDo not lift upper body off seat to heave the weight.',
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 12,
    name: 'Commercial Flat / Incline / Decline (FID) Bench',
    category: 'Free Weights / Benches',
    target_body_part: 'Chest',
    description: 'Multi-angle steel utility bench with laser-cut angle adjustment notches ranging from -15 to +85 degrees.',
    primary_purpose: 'Platform foundation for all dumbbell pressing, seated rows, and arm work',
    benefits: 'Sturdy 450kg weight rating ensures complete stability during heavy dumbbell work.\nQuick-switch adjustment pin facilitates effortless transition from flat to incline.',
    how_to_use: 'Step 1: Pull pop-pin and adjust backrest to target angle (0, 30, 45, or 60 degrees).\nStep 2: Adjust seat angle accordingly to prevent sliding downward.\nStep 3: Ensure locking pin is fully seated in notch before sitting.',
    safety_instructions: 'Inspect locking pin engagement before sitting with heavy dumbbells.\nKeep head, shoulders, and hips in steady contact with bench upholstery.',
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60',
  },
];

const EXERCISES_DATA = [
  {
    id: 1,
    name: 'Barbell Back Squat',
    body_part: 'Legs',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 1,
    description: 'The premier compound lower-body exercise recruiting the quadriceps, adductors, gluteus maximus, and spinal erectors.',
    instructions: 'Set barbell on J-hooks at mid-chest height.\nStep under bar and pin it across upper trapezius with hands gripping outside shoulders.\nUnrack bar, take two calculated steps back, and establish shoulder-width foot position.\nInhale deeply, brace abdominal wall, and sit back and down into hips.\nDescend until hip crease is below knee level.\nDrive forcefully through mid-foot to stand erect.',
    benefits: 'Develops full lower body explosive power and functional strength.\nStimulates systemic endocrine adaptation.\nStrengthens lumbar spine and core stability.',
    safety_tips: 'Keep knees tracking in line with toes.\nMaintain a rigid neutral lumbar posture.\nAlways squat inside a rack with safety pins deployed.',
    common_mistakes: 'Allowing knees to cave inward during ascent.\nRounding the lumbar spine at bottom of squat.\nRising onto toes rather than mid-foot balance.',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Barbell Bench Press',
    body_part: 'Chest',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 1,
    description: 'Fundamental horizontal pressing movement building pectoralis major mass, anterior deltoid density, and tricep extension strength.',
    instructions: 'Lie flat on bench with eyes positioned directly under the racked bar.\nRetract and depress shoulder blades into the bench pad.\nGrasp bar with overhand grip slightly wider than shoulder width.\nUnrack bar, stabilize over sternum, and inhale deeply.\nLower bar in a controlled path to touch mid-chest.\nPress bar upward and slightly back toward eye line until arms extend.',
    benefits: 'Maximizes upper body horizontal pressing force production.\nBuilds anterior upper-body muscular thickness.\nHigh carryover to athletic pushing movements.',
    safety_tips: 'Keep feet planted firmly into the floor.\nDo not flare elbows perpendicular to torso.\nMaintain tight scapular retraction throughout.',
    common_mistakes: 'Bouncing the barbell violently off sternum.\nFlaring elbows outward at 90 degrees putting rotator cuffs at risk.\nLifting hips off the bench surface.',
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Conventional Barbell Deadlift',
    body_part: 'Back',
    category: 'Compound',
    difficulty: 'Advanced',
    equipment_id: 1,
    description: 'The ultimate posterior chain test targeting hamstrings, gluteals, latissimus dorsi, and spinal erectors from a dead stop.',
    instructions: 'Stand with mid-foot directly under the barbell with hip-width stance.\nHinge at hips and grip barbell just outside shins.\nPull chest up, drop hips slightly, and engage lats to remove bar slack.\nTake a deep intra-abdominal breath and brace core.\nDrive through the floor, extending knees and hips simultaneously.\nLock out hips at top without hyperextending lower back.\nReturn bar to floor by hinging hips back.',
    benefits: 'Develops unbreakable posterior chain and spinal erector strength.\nMassive forearm grip and trapezius hypertrophy.\nSuperior carryover to functional lifting in daily life.',
    safety_tips: 'Do not yank bar aggressively off the floor.\nKeep barbell in continuous contact with legs throughout the pull.\nNever round the lumbar spine.',
    common_mistakes: 'Rounding lower back like a fishing rod under load.\nHitching or bouncing the barbell off thighs.\nHyperextending lumbar spine excessively at lockout.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'Overhead Barbell Military Press',
    body_part: 'Shoulders',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 1,
    description: 'Strict standing vertical press building medial and anterior deltoid strength, triceps, and upper-chest clavicular head.',
    instructions: 'Position bar at collarbone level with shoulder-width overhand grip.\nStep away from rack with glutes squeezed and abs braced.\nPress barbell vertically upward, moving head back slightly to clear bar path.\nLock out bar overhead with biceps aligned with ears.\nLower bar under control back to clavicle.',
    benefits: 'Builds round, cannonball shoulder deltoids.\nDemands total core and glute stabilization without a backrest.\nImproves scapular upward rotation health.',
    safety_tips: 'Keep ribcage tucked down to prevent excessive lumbar arching.\nSqueeze glutes hard throughout the entire press.',
    common_mistakes: 'Leaning back excessively to turn it into an incline bench press.\nPushing bar too far forward away from center of gravity.\nBouncing with knee dip.',
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    name: 'Wide-Grip Lat Pulldown',
    body_part: 'Back',
    category: 'Compound',
    difficulty: 'Beginner',
    equipment_id: 4,
    description: 'Vertical pulling exercise targeting the latissimus dorsi width and teres major.',
    instructions: 'Sit upright with thighs anchored under roller pads.\nGrasp bar with overhand grip wider than shoulders.\nDepress shoulder blades down and pull bar smoothly to collarbone.\nSqueeze lats hard at bottom position.\nSlowly extend arms overhead to feel deep lat stretch.',
    benefits: 'Broadens upper back creating classic athletic V-taper.\nSafe progression path for athletes unable to perform bodyweight pull-ups.\nMinimal strain on lower back.',
    safety_tips: 'Keep torso upright with slight 10-degree natural lean.\nLead the pull with elbows driving downward.',
    common_mistakes: 'Yanking body backward to 45 degrees using momentum.\nPulling bar down to stomach instead of clavicle.\nShrugging shoulders into ears at contraction.',
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    name: 'Incline Dumbbell Bench Press',
    body_part: 'Chest',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 12,
    description: 'Incline press on a 30-degree utility bench prioritizing the clavicular head of pectoralis major and anterior deltoids.',
    instructions: 'Set adjustable bench to 30 degrees angle.\nSit with dumbbells resting on knees, then kick weights back to shoulders as you lie flat.\nRetract shoulder blades and plant feet firmly on the floor.\nPress dumbbells upward in a slight converging arc.\nLower dumbbells slowly until elbows are level with torso.',
    benefits: 'Fills out the upper chest region under collarbone.\nAllows independent wrist and elbow freedom reducing shoulder impingement.\nBuilds unilateral shoulder stability.',
    safety_tips: 'Avoid setting bench angle above 45 degrees to avoid excessive front delt dominance.\nKeep wrists stacked directly over elbows.',
    common_mistakes: 'Setting incline too steep (60 degrees) turning exercise into shoulder press.\nCollapsing chest and letting shoulder blades unlock.\nDropping weights abruptly.',
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 7,
    name: 'Seated Cable Row',
    body_part: 'Back',
    category: 'Compound',
    difficulty: 'Beginner',
    equipment_id: 9,
    description: 'Horizontal cable row targeting middle trapezius, rhomboid retraction, and lat thickness.',
    instructions: 'Sit upright on bench with feet flat on footrests and knees slightly bent.\nGrasp V-grip handle with neutral grip.\nBrace core, sit tall, and pull handle toward belly button.\nRetract shoulder blades forcefully at peak contraction.\nReturn slowly forward until arms reach full extension.',
    benefits: 'Builds back thickness and reinforces upright posture.\nCounteracts forward shoulder slump from desk work.\nVery safe on lower back.',
    safety_tips: 'Keep chest proud and shoulders pulled away from ears.\nDo not let knees lock out completely.',
    common_mistakes: 'Swinging upper body backward and forward like a rowing rower.\nRounding thoracic spine at release.\nUsing biceps instead of back muscles to pull.',
    image_url: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 8,
    name: '45-Degree Leg Press',
    body_part: 'Legs',
    category: 'Compound',
    difficulty: 'Beginner',
    equipment_id: 3,
    description: 'Machine compound movement for massive lower body quadriceps, glute, and hamstring development.',
    instructions: 'Sit in machine with lower back firmly pinned against pad.\nPlace feet shoulder-width in middle of footplate.\nRelease safety lockout levers with handles.\nLower carriage smoothly until knees achieve 90-degree flexion.\nDrive through whole foot to press carriage back up without locking knees.',
    benefits: 'Allows intense quad overload without spinal balance constraints.\nAdjustable foot placements target quads or glutes specifically.\nBuilt-in safety catches.',
    safety_tips: 'Never allow lower back to lift or round away from back pad.\nMaintain controlled 3-second lowering cadence.',
    common_mistakes: 'Locking out knees aggressively causing joint hyperextension.\nPlacing feet too low causing severe knee overhang.\nLifting pelvis off pad.',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 9,
    name: 'Dumbbell Romanian Deadlift (RDL)',
    body_part: 'Legs',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 8,
    description: 'Hip-hinge movement maximizing eccentric hamstring tension and gluteal contraction.',
    instructions: 'Stand tall holding a pair of dumbbells in front of thighs.\nEstablish hip-width stance with knees slightly unlocked.\nPush hips back as if trying to touch wall behind you with tailbone.\nLower dumbbells along shins while maintaining flat spine.\nPause at mid-shin when hamstrings reach deep stretch.\nDrive hips forward to return to standing position.',
    benefits: 'Tremendous hamstring muscle fiber growth via eccentric loading.\nStrengthens hip hinge pattern for better athletic sprint power.\nDevelops gluteal-hamstring tie-in.',
    safety_tips: 'Keep dumbbells skimming close to legs throughout.\nDo not squat down; push hips backward horizontally.',
    common_mistakes: 'Rounding spine to reach dumbbells to floor.\nBending knees into a squat rather than a hip hinge.\nHyperextending lower back at top.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 10,
    name: 'Standing Dumbbell Lateral Raise',
    body_part: 'Shoulders',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 8,
    description: 'Medial deltoid isolation exercise creating width and definition across the shoulders.',
    instructions: 'Stand tall with dumbbells held at sides with slight forward torso lean.\nBend elbows slightly (10-15 degrees).\nRaise dumbbells out to sides until elbows reach shoulder height.\nLead with elbows and keep pinkies slightly elevated.\nLower weights with strict 2-second control.',
    benefits: 'Builds shoulder width and clavicular silhouette.\nIsolates lateral head without front delt dominance.\nLightweight high-rep muscle stimulation.',
    safety_tips: 'Do not use hip swing or knee bounce to initiate movement.\nKeep thumbs slightly lower than pinkies.',
    common_mistakes: 'Using heavy weights and swinging hips violently.\nRaising hands higher than elbows.\nShrugging traps to lift weights.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 11,
    name: 'Seated Leg Extension',
    body_part: 'Legs',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 5,
    description: 'Direct quadriceps isolation machine targeting all four heads with concentrated peak contraction.',
    instructions: 'Sit in machine with back pad adjusted so knee joint aligns with machine pivot.\nPosition shin pad comfortably above ankle joints.\nExtend legs upward until fully straight, pausing 1 second at top.\nLower weight smoothly without letting stack slam.',
    benefits: 'Direct rectus femoris and vastus medialis isolation.\nIdeal for quad pump and knee rehab protocols.\nZero balance requirement.',
    safety_tips: 'Keep hips pressed firmly into seat using side handles.\nControl eccentric lowering phase.',
    common_mistakes: 'Kicking weight up fast with ballistic momentum.\nAdjusting pad too high up on shins.\nLifting body out of seat.',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 12,
    name: 'Prone Lying Leg Curl',
    body_part: 'Legs',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 6,
    description: 'Direct knee-flexor hamstring isolation targeting biceps femoris and semitendinosus.',
    instructions: 'Lie prone on bench with knees just below edge of pad.\nPosition ankle pad against lower calf / Achilles tendon.\nGrasp handles and keep hips flat on bench.\nCurl heels upward toward glutes until full knee flexion.\nLower weight in a 3-second eccentric tempo.',
    benefits: 'Provides dedicated knee-flexion hamstring work complementary to hip-hinges.\nProtects anterior cruciate ligament (ACL) stability.\nDirect posterior thigh muscle pump.',
    safety_tips: 'Keep hips flat on pad throughout repetition.\nDo not arch lumbar spine to generate leverage.',
    common_mistakes: 'Lifting hips high in the air while curling.\nJerking weights with lower back momentum.\nLetting weights slam at bottom.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 13,
    name: 'Standing Cable Face Pull',
    body_part: 'Shoulders',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 2,
    description: 'Crucial postural health exercise targeting rear deltoids, rotator cuff external rotators, and lower traps.',
    instructions: 'Set cable pulley at upper chest / eye level with rope attachment.\nGrasp rope with thumbs pointing backward.\nStep back into athletic split stance.\nPull rope toward nose while rotating knuckles backward.\nSqueeze rear shoulders and shoulder blades for 1 second.\nReturn smoothly under tension.',
    benefits: 'Counteracts rounded forward-shoulder posture.\nStrengthens infraspinatus and teres minor rotator cuff muscles.\nEssential injury-prevention tool for bench pressers.',
    safety_tips: 'Focus on external rotation at peak of movement.\nKeep elbows high and wide.',
    common_mistakes: 'Pulling down toward throat like a row instead of face.\nUsing too much weight and leaning backward.\nDropping elbows down.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 14,
    name: 'Dumbbell Hammer Curl',
    body_part: 'Arms',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 8,
    description: 'Neutral-grip arm curl isolating the brachialis and brachioradialis for forearm and arm thickness.',
    instructions: 'Stand tall holding dumbbells with neutral palms-facing-each-other grip.\nKeep elbows pinned closely against ribs.\nCurl dumbbells upward toward shoulders while maintaining neutral grip.\nSqueeze peak contraction at top.\nLower dumbbells with controlled 2-second tempo.',
    benefits: 'Builds the brachialis muscle under biceps, pushing bicep peak higher.\nThickens forearms and enhances grip strength.\nMore joint-friendly on wrists than straight bar curls.',
    safety_tips: 'Do not swing elbows forward away from torso.\nKeep wrists rigid and aligned.',
    common_mistakes: 'Swinging torso backward to heave heavy weights.\nFlaring elbows outward away from body.\nRotating palms up halfway.',
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 15,
    name: 'Tricep Rope Cable Pushdown',
    body_part: 'Arms',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 2,
    description: 'Constant-tension tricep cable isolation emphasizing the lateral and medial heads.',
    instructions: 'Attach rope attachment to high cable pulley.\nGrasp rope and step back slightly with knees soft.\nPin elbows to sides and tuck them against ribs.\nPush rope downward, spreading ends apart at bottom lockout.\nPause for peak tricep contraction.\nReturn hands slowly to chest level.',
    benefits: 'Constant cable tension throughout entire range of motion.\nSpreading rope at bottom fully recruits lateral tricep head.\nSafe on elbow tendons.',
    safety_tips: 'Keep upper arms fixed like statues.\nDo not lean heavy bodyweight over the rope.',
    common_mistakes: 'Flaring elbows outward and turning it into a press.\nUsing shoulder movement to move the cable.\nLetting weights slam between reps.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 16,
    name: 'Barbell EZ-Curl Preacher Curl',
    body_part: 'Arms',
    category: 'Isolation',
    difficulty: 'Intermediate',
    equipment_id: 11,
    description: 'Strict bicep isolation locking upper arm against angled preacher pad to eliminate body swing.',
    instructions: 'Sit at preacher bench with armpits snug against top pad.\nGrasp EZ-bar on inner camber with underhand grip.\nLower bar under control until arms are almost fully straight.\nCurl bar upward by flexing biceps.\nSqueeze bicep peak at top without lifting elbows off pad.',
    benefits: 'Eliminates all momentum forcing biceps to perform 100% of the work.\nIsolates the short inner head of the biceps.\nDevelops deep bicep definition.',
    safety_tips: 'Never abruptly bounce at the bottom extension.\nKeep wrists straight and rigid.',
    common_mistakes: 'Lifting body off seat to initiate curl.\nDropping bar fast risking distal bicep strain.\nShrugging shoulders.',
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 17,
    name: 'Hanging Knee / Leg Raise',
    body_part: 'Core',
    category: 'Isolation',
    difficulty: 'Intermediate',
    equipment_id: 1,
    description: 'Functional hanging core exercise strengthening the rectus abdominis, hip flexors, and grip.',
    instructions: 'Hang from pull-up bar with overhand grip slightly wider than shoulders.\nDepress shoulders and engage lats to eliminate swinging.\nCurl knees upward toward chest, rounding pelvis forward.\nPause for 1 second at top contraction.\nLower legs under control back to starting dead hang.',
    benefits: 'Develops lower abdominal wall strength and pelvic control.\nDecompresses spinal column while hanging.\nBuilds forearm grip endurance.',
    safety_tips: 'Roll pelvis upward at top of repetition to activate abdominals.\nDo not swing legs with momentum.',
    common_mistakes: 'Swinging body back and forth using pendulum momentum.\nOnly flexing hips without curling pelvis forward.\nShrugging shoulders into ears.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 18,
    name: 'Plank with Core Bracing',
    body_part: 'Core',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: null,
    description: 'Isometric core stability pillar testing rectus abdominis, transverse abdominis, and glutes.',
    instructions: 'Place forearms on floor with elbows directly below shoulders.\nExtend legs behind with toes tucked onto floor.\nSqueeze glutes, tuck pelvis, and brace abdominal wall as if anticipating a punch.\nHold rigid straight line from head to heels for prescribed duration.\nBreathe rhythmically without dropping hips.',
    benefits: 'Develops anti-extension spinal stability.\nStrengthens deep transverse abdominal core girdle.\nProtects lumbar spine during heavy standing compound lifts.',
    safety_tips: 'Keep head neutral looking down at hands.\nDo not hold breath.',
    common_mistakes: 'Sagging hips toward the floor placing shearing load on lumbar spine.\nPiking hips high in the air.\nHyperextending cervical spine looking upward.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 19,
    name: 'Standing Machine Calf Raise',
    body_part: 'Legs',
    category: 'Isolation',
    difficulty: 'Beginner',
    equipment_id: 10,
    description: 'Direct calf gastrocnemius hypertrophy training over an elevated deficit block.',
    instructions: 'Place shoulder pads comfortably over traps and stand upright.\nPosition balls of feet on elevated block with heels hanging off.\nLower heels deeply into full calf stretch.\nDrive through big toes to elevate heels as high as possible.\nPause 2 seconds at peak contraction before lowering.',
    benefits: 'Direct gastrocnemius muscle growth.\nStrengthens Achilles tendon elasticity and running mechanics.\nIncreases ankle dorsiflexion mobility.',
    safety_tips: 'Execute with strict pause at bottom stretch to eliminate Achilles bounce.\nKeep knees slightly soft.',
    common_mistakes: 'Bouncing rapidly up and down like a pogo stick.\nCutting range of motion short.\nRolling onto outside of feet.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 20,
    name: 'Dumbbell Walking Lunge',
    body_part: 'Legs',
    category: 'Compound',
    difficulty: 'Intermediate',
    equipment_id: 8,
    description: 'Dynamic unilateral lower body movement training quads, glutes, core stability, and hip balance.',
    instructions: 'Stand tall holding a pair of dumbbells at sides.\nTake a controlled step forward with right leg.\nDrop back knee downward until it gently taps the floor.\nFront shin should remain nearly vertical.\nDrive through right front heel to stand up and step forward with left leg.\nAlternate smoothly across floor.',
    benefits: 'Superb unilateral leg hypertrophy and balance conditioning.\nStretches hip flexors of the trailing leg.\nHigh metabolic cardiovascular output.',
    safety_tips: 'Keep torso upright with braced core.\nDo not let front knee collapse inward.',
    common_mistakes: 'Banging trailing knee violently onto hard floor.\nTaking steps that are too short jamming front knee.\nLeaning torso heavily forward.',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 21,
    name: 'Cable Chest Flye',
    body_part: 'Chest',
    category: 'Isolation',
    difficulty: 'Intermediate',
    equipment_id: 2,
    description: 'Continuous tension horizontal adduction movement isolating pectoralis major fibers.',
    instructions: 'Set cable pulleys at chest height with D-handles.\nGrasp handles, step forward into staggered stance, and bend elbows slightly.\nBring hands together in wide hugging arc until knuckles touch in front of chest.\nSqueeze inner chest hard at peak contraction.\nOpen arms back under control to feel deep pectoral stretch.',
    benefits: 'Constant tension across entire range of motion.\nSafely isolates chest without tricep exhaustion.\nHigh mind-muscle connection.',
    safety_tips: 'Keep elbow bend fixed throughout movement.\nDo not let hands travel behind shoulders during stretch.',
    common_mistakes: 'Turning flye into a pressing motion by pushing from elbows.\nUsing too much weight causing shoulders to round forward.\nLetting cables pull arms too far back.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
];

const WORKOUT_PLANS_DATA = [
  {
    id: 1,
    name: 'Push-Pull-Legs (PPL) Hypertrophy Split',
    goal: 'Muscle Building',
    difficulty: 'Intermediate',
    duration_weeks: 12,
    description:
      'A periodized 3-day split designed for maximal muscular hypertrophy. Days are logically divided into upper-body pushing mechanics, upper-body pulling mechanics, and lower-body development.',
    created_by: 1,
    trainer_name: 'Coach Vikram Malhotra',
    exercises: [
      { exercise_id: 2, day_or_order: 'Day 1: Push (Chest, Delts, Triceps)', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Focus on steady 2-second eccentric lowering.' },
      { exercise_id: 6, day_or_order: 'Day 1: Push (Chest, Delts, Triceps)', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Set bench at 30 degrees.' },
      { exercise_id: 10, day_or_order: 'Day 1: Push (Chest, Delts, Triceps)', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Lead with elbows, pause 1 second at top.' },
      { exercise_id: 15, day_or_order: 'Day 1: Push (Chest, Delts, Triceps)', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Spread rope at bottom lockout.' },
      { exercise_id: 3, day_or_order: 'Day 2: Pull (Back, Rear Delts, Biceps)', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Reset on floor between each repetition.' },
      { exercise_id: 5, day_or_order: 'Day 2: Pull (Back, Rear Delts, Biceps)', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Pull bar smoothly to upper clavicle.' },
      { exercise_id: 13, day_or_order: 'Day 2: Pull (Back, Rear Delts, Biceps)', sets: 3, reps: '15-20', rest_seconds: 60, notes: 'Rotate thumbs back to recruit rear delts.' },
      { exercise_id: 14, day_or_order: 'Day 2: Pull (Back, Rear Delts, Biceps)', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Strict arm curl without torso swinging.' },
      { exercise_id: 1, day_or_order: 'Day 3: Legs & Core', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Descend below parallel with midfoot balance.' },
      { exercise_id: 8, day_or_order: 'Day 3: Legs & Core', sets: 3, reps: '10-12', rest_seconds: 90, notes: 'Control lowering, do not lock knees.' },
      { exercise_id: 12, day_or_order: 'Day 3: Legs & Core', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Keep hips firmly against bench.' },
      { exercise_id: 17, day_or_order: 'Day 3: Legs & Core', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Curl pelvis upward at peak.' },
    ],
  },
  {
    id: 2,
    name: 'Beginner Foundation Strength Program',
    goal: 'Strength',
    difficulty: 'Beginner',
    duration_weeks: 8,
    description:
      'An introductory linear progression routine establishing fundamental motor patterns, compound barbell proficiency, and general physical preparedness.',
    created_by: 1,
    trainer_name: 'Coach Vikram Malhotra',
    exercises: [
      { exercise_id: 1, day_or_order: 'Session A', sets: 3, reps: '5', rest_seconds: 120, notes: 'Establish comfortable stance and depth.' },
      { exercise_id: 2, day_or_order: 'Session A', sets: 3, reps: '5', rest_seconds: 120, notes: 'Keep wrists stacked and scapulae tight.' },
      { exercise_id: 7, day_or_order: 'Session A', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Sit tall and squeeze back.' },
      { exercise_id: 18, day_or_order: 'Session A', sets: 3, reps: '45 sec hold', rest_seconds: 60, notes: 'Brace core as a rigid plank.' },
      { exercise_id: 3, day_or_order: 'Session B', sets: 3, reps: '5', rest_seconds: 150, notes: 'Maintain flat neutral spine.' },
      { exercise_id: 4, day_or_order: 'Session B', sets: 3, reps: '5', rest_seconds: 120, notes: 'Strict press without knee bounce.' },
      { exercise_id: 5, day_or_order: 'Session B', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Control overhead stretch.' },
      { exercise_id: 14, day_or_order: 'Session B', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Controlled tempo bicep curl.' },
    ],
  },
  {
    id: 3,
    name: 'Upper-Lower Powerbuilding System',
    goal: 'Strength',
    difficulty: 'Advanced',
    duration_weeks: 10,
    description:
      'A high-intensity split combining heavy compound barbell lifts for maximal strength with targeted hypertrophy volume for dense muscular development.',
    created_by: 2,
    trainer_name: 'Coach Ananya Roy',
    exercises: [
      { exercise_id: 2, day_or_order: 'Day 1: Upper Power', sets: 5, reps: '5', rest_seconds: 150, notes: 'Heavy working sets with strict paused touch.' },
      { exercise_id: 7, day_or_order: 'Day 1: Upper Power', sets: 4, reps: '6-8', rest_seconds: 90, notes: 'Heavy close-grip row.' },
      { exercise_id: 4, day_or_order: 'Day 1: Upper Power', sets: 3, reps: '6-8', rest_seconds: 90, notes: 'Standing military press.' },
      { exercise_id: 16, day_or_order: 'Day 1: Upper Power', sets: 3, reps: '8-10', rest_seconds: 60, notes: 'Preacher curl isolation.' },
      { exercise_id: 1, day_or_order: 'Day 2: Lower Power', sets: 5, reps: '5', rest_seconds: 180, notes: 'Heavy back squat series.' },
      { exercise_id: 9, day_or_order: 'Day 2: Lower Power', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Deep hamstring stretch on RDL.' },
      { exercise_id: 11, day_or_order: 'Day 2: Lower Power', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Quad peak contraction pump.' },
      { exercise_id: 19, day_or_order: 'Day 2: Lower Power', sets: 4, reps: '15', rest_seconds: 60, notes: '2-second pause at bottom stretch.' },
    ],
  },
  {
    id: 4,
    name: 'Full-Body Athletic Conditioning',
    goal: 'General Fitness',
    difficulty: 'Intermediate',
    duration_weeks: 6,
    description:
      'A high-density training regimen utilizing compound movements, unilateral exercises, and metabolic core circuits to elevate cardiovascular stamina and lean muscle mass.',
    created_by: 3,
    trainer_name: 'Coach Kabir Singh',
    exercises: [
      { exercise_id: 20, day_or_order: 'Day 1: Athletic Circuit', sets: 3, reps: '12 steps/leg', rest_seconds: 60, notes: 'Keep torso upright throughout lunges.' },
      { exercise_id: 6, day_or_order: 'Day 1: Athletic Circuit', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Incline press with active core.' },
      { exercise_id: 5, day_or_order: 'Day 1: Athletic Circuit', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Smooth vertical pull.' },
      { exercise_id: 18, day_or_order: 'Day 1: Athletic Circuit', sets: 3, reps: '60 sec hold', rest_seconds: 45, notes: 'Maximum abdominal bracing.' },
    ],
  },
  {
    id: 5,
    name: 'Functional Core & Mobility Protocol',
    goal: 'General Fitness',
    difficulty: 'Beginner',
    duration_weeks: 4,
    description:
      'A restorative routine focusing on thoracic extension, hip mobility, spinal anti-extension, and posterior chain endurance.',
    created_by: 2,
    trainer_name: 'Coach Ananya Roy',
    exercises: [
      { exercise_id: 17, day_or_order: 'Routine 1', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Slow controlled knee raise.' },
      { exercise_id: 18, day_or_order: 'Routine 1', sets: 3, reps: '45 sec hold', rest_seconds: 45, notes: 'Strict pelvic tuck.' },
      { exercise_id: 13, day_or_order: 'Routine 1', sets: 3, reps: '15', rest_seconds: 45, notes: 'External rotator cuff focus.' },
      { exercise_id: 9, day_or_order: 'Routine 1', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Bodyweight / light dumbbell hip hinge mobility.' },
    ],
  },
];

const ATTENDANCE_DATA = [
  { member_id: 1, date: '2026-09-01', check_in_time: '06:45 AM', check_out_time: '08:15 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-03', check_in_time: '06:50 AM', check_out_time: '08:20 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-05', check_in_time: '07:05 AM', check_out_time: '08:35 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-08', check_in_time: '06:40 AM', check_out_time: '08:10 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-10', check_in_time: '06:55 AM', check_out_time: '08:25 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-12', check_in_time: '07:15 AM', check_out_time: '08:45 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-15', check_in_time: '06:45 AM', check_out_time: '08:15 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-17', check_in_time: '06:50 AM', check_out_time: '08:20 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-19', check_in_time: '07:00 AM', check_out_time: '08:30 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-22', check_in_time: '06:45 AM', check_out_time: '08:15 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-24', check_in_time: '06:50 AM', check_out_time: '08:20 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-26', check_in_time: '07:10 AM', check_out_time: '08:40 AM', status: 'Present' },
  { member_id: 1, date: '2026-09-29', check_in_time: '06:45 AM', check_out_time: '08:15 AM', status: 'Present' },
  { member_id: 1, date: '2026-10-01', check_in_time: '06:55 AM', check_out_time: '08:25 AM', status: 'Present' },
  { member_id: 1, date: '2026-10-03', check_in_time: '07:00 AM', check_out_time: '08:30 AM', status: 'Present' },
  { member_id: 2, date: '2026-09-16', check_in_time: '05:30 PM', check_out_time: '07:00 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-18', check_in_time: '05:45 PM', check_out_time: '07:15 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-21', check_in_time: '05:25 PM', check_out_time: '06:55 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-23', check_in_time: '05:35 PM', check_out_time: '07:05 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-25', check_in_time: '05:40 PM', check_out_time: '07:10 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-28', check_in_time: '05:30 PM', check_out_time: '07:00 PM', status: 'Present' },
  { member_id: 2, date: '2026-09-30', check_in_time: '05:45 PM', check_out_time: '07:15 PM', status: 'Present' },
  { member_id: 2, date: '2026-10-02', check_in_time: '05:30 PM', check_out_time: '07:00 PM', status: 'Present' },
  { member_id: 3, date: '2026-09-15', check_in_time: '08:00 AM', check_out_time: '09:15 AM', status: 'Present' },
  { member_id: 3, date: '2026-09-17', check_in_time: '08:10 AM', check_out_time: '09:25 AM', status: 'Present' },
  { member_id: 3, date: '2026-09-20', check_in_time: '08:05 AM', check_out_time: '09:20 AM', status: 'Present' },
  { member_id: 3, date: '2026-09-24', check_in_time: '08:15 AM', check_out_time: '09:30 AM', status: 'Present' },
  { member_id: 3, date: '2026-09-27', check_in_time: '08:00 AM', check_out_time: '09:15 AM', status: 'Present' },
];

const PROGRESS_DATA = [
  { member_id: 1, measured_on: '2026-01-10', weight_kg: 82.5, height_cm: 178.0, bmi: 26.0, notes: 'Baseline onboarding assessment. Target: lean mass development and sub-15% body fat.' },
  { member_id: 1, measured_on: '2026-03-15', weight_kg: 80.2, height_cm: 178.0, bmi: 25.3, notes: 'Significant reduction in waist circumference. Squat and bench press numbers trending upward.' },
  { member_id: 1, measured_on: '2026-06-20', weight_kg: 78.8, height_cm: 178.0, bmi: 24.9, notes: 'Achieved target normal BMI classification. Increased working sets on PPL split.' },
  { member_id: 1, measured_on: '2026-09-15', weight_kg: 77.5, height_cm: 178.0, bmi: 24.5, notes: 'Excellent athletic composition. Coach Vikram notes improved ankle mobility on squats.' },
  { member_id: 2, measured_on: '2026-01-15', weight_kg: 68.0, height_cm: 165.0, bmi: 25.0, notes: 'Baseline consultation with Coach Ananya. Focus on posterior chain tone and posture.' },
  { member_id: 2, measured_on: '2026-04-10', weight_kg: 65.5, height_cm: 165.0, bmi: 24.1, notes: 'Noticeable increase in upper body pulling endurance. Deadlift form pristine.' },
  { member_id: 2, measured_on: '2026-07-25', weight_kg: 63.8, height_cm: 165.0, bmi: 23.4, notes: 'Consistent adherence to 4-day resistance training split and nutritional goals.' },
  { member_id: 3, measured_on: '2026-02-01', weight_kg: 88.0, height_cm: 180.0, bmi: 27.2, notes: 'Initial enrollment assessment. Goal: weight loss and cardiovascular reconditioning.' },
  { member_id: 3, measured_on: '2026-05-10', weight_kg: 84.5, height_cm: 180.0, bmi: 26.1, notes: '3.5 kg fat mass loss recorded on body composition monitor.' },
];

const CONTACT_MESSAGES_DATA = [
  {
    id: 1,
    name: 'Siddharth Joshi',
    email: 'siddharth@example.com',
    phone: '+91 98220 12345',
    subject: 'Inquiry regarding student semester discounts',
    message: 'Hello GYMKHANA administration, I am an engineering student at the campus and would like to know if there are dedicated student concessions on the 6-month Standard Pass.',
    is_read: 1,
  },
  {
    id: 2,
    name: 'Meera Nambiar',
    email: 'meera.n@example.com',
    phone: '+91 97441 55667',
    subject: 'Trainer consultation with Coach Ananya',
    message: 'Good afternoon. I am interested in personal biomechanics and posture correction with Coach Ananya Roy. Could you confirm her current training slot availability for morning sessions?',
    is_read: 0,
  },
];

export async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Purging existing collections for clean seed...');

    await Promise.all([
      User.deleteMany({}),
      Membership.deleteMany({}),
      Trainer.deleteMany({}),
      Member.deleteMany({}),
      Equipment.deleteMany({}),
      Exercise.deleteMany({}),
      WorkoutPlan.deleteMany({}),
      Attendance.deleteMany({}),
      Progress.deleteMany({}),
      ContactMessage.deleteMany({}),
      Counter.deleteMany({}),
    ]);

    console.log('1. Seeding Users...');
    const userDocs = await User.insertMany(USERS_DATA);
    const userMap = {};
    userDocs.forEach((u) => {
      userMap[u.id] = u;
    });

    console.log('2. Seeding Memberships...');
    const membershipDocs = await Membership.insertMany(MEMBERSHIPS_DATA);
    const membershipMap = {};
    membershipDocs.forEach((m) => {
      membershipMap[m.id] = m;
    });

    console.log('3. Seeding Trainers...');
    const trainerFormatted = TRAINERS_DATA.map((t) => ({
      ...t,
      user: userMap[t.user_id]._id,
    }));
    const trainerDocs = await Trainer.insertMany(trainerFormatted);
    const trainerMap = {};
    trainerDocs.forEach((t) => {
      trainerMap[t.id] = t;
    });

    console.log('4. Seeding Members...');
    const memberFormatted = MEMBERS_DATA.map((m) => ({
      ...m,
      user: userMap[m.user_id]._id,
      membership: m.membership_id ? membershipMap[m.membership_id]._id : null,
      trainer: m.trainer_id ? trainerMap[m.trainer_id]._id : null,
    }));
    const memberDocs = await Member.insertMany(memberFormatted);
    const memberMap = {};
    memberDocs.forEach((m) => {
      memberMap[m.id] = m;
    });

    console.log('5. Seeding Equipment...');
    const equipmentDocs = await Equipment.insertMany(EQUIPMENT_DATA);
    const equipmentMap = {};
    equipmentDocs.forEach((e) => {
      equipmentMap[e.id] = e;
    });

    console.log('6. Seeding Exercises...');
    const exerciseFormatted = EXERCISES_DATA.map((ex) => ({
      ...ex,
      equipment: ex.equipment_id ? equipmentMap[ex.equipment_id]._id : null,
    }));
    const exerciseDocs = await Exercise.insertMany(exerciseFormatted);
    const exerciseMap = {};
    exerciseDocs.forEach((e) => {
      exerciseMap[e.id] = e;
    });

    console.log('7. Seeding Workout Plans...');
    const planFormatted = WORKOUT_PLANS_DATA.map((p) => {
      const enrichedExercises = p.exercises.map((item, idx) => {
        const ex = exerciseMap[item.exercise_id];
        return {
          id: idx + 1,
          exercise_id: item.exercise_id,
          exercise: ex ? ex._id : null,
          day_or_order: item.day_or_order,
          sets: item.sets,
          reps: item.reps,
          rest_seconds: item.rest_seconds,
          notes: item.notes,
          exercise_name: ex ? ex.name : 'Exercise',
          body_part: ex ? ex.body_part : 'Full Body',
          exercise_difficulty: ex ? ex.difficulty : 'Beginner',
          image_url: ex ? ex.image_url : null,
        };
      });

      return {
        id: p.id,
        name: p.name,
        goal: p.goal,
        difficulty: p.difficulty,
        duration_weeks: p.duration_weeks,
        description: p.description,
        created_by: p.created_by,
        trainer: p.created_by ? trainerMap[p.created_by]._id : null,
        trainer_name: p.trainer_name,
        exercises: enrichedExercises,
      };
    });
    await WorkoutPlan.insertMany(planFormatted);

    console.log('8. Seeding Attendance...');
    const attFormatted = ATTENDANCE_DATA.map((a, idx) => ({
      id: idx + 1,
      ...a,
      member: memberMap[a.member_id] ? memberMap[a.member_id]._id : null,
    }));
    await Attendance.insertMany(attFormatted);

    console.log('9. Seeding Progress...');
    const progFormatted = PROGRESS_DATA.map((p, idx) => ({
      id: idx + 1,
      ...p,
      member: memberMap[p.member_id] ? memberMap[p.member_id]._id : null,
    }));
    await Progress.insertMany(progFormatted);

    console.log('10. Seeding Contact Messages...');
    await ContactMessage.insertMany(CONTACT_MESSAGES_DATA);

    console.log('11. Initializing Sequence Counters...');
    await setSequence('users', 7);
    await setSequence('memberships', 3);
    await setSequence('trainers', 3);
    await setSequence('members', 3);
    await setSequence('equipment', 12);
    await setSequence('exercises', 21);
    await setSequence('workout_plans', 5);
    await setSequence('attendance', attFormatted.length);
    await setSequence('progress', progFormatted.length);
    await setSequence('contact_messages', 2);

    console.log('=======================================================');
    console.log(' GYMKHANA MONGODB DATABASE SEEDED SUCCESSFULLY!');
    console.log('=======================================================');
    return true;
  } catch (error) {
    console.error('Seed Error:', error);
    throw error;
  }
}

// Auto-run if executed directly via node src/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
