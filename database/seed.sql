-- ============================================================================
-- GYMKHANA DATABASE SEED DATA
-- Authentic, production-style demo data for college field project evaluation
-- ============================================================================

USE gymkhana_db;

-- ----------------------------------------------------------------------------
-- 1. USERS
-- Password Hashes:
-- Admin@123   : $2a$10$xJWQc50Wv788/YRet/XO9e7UX4n8lMLAaex/uYB3Tb4NMWkg0FHuK
-- Trainer@123 : $2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm
-- Member@123  : $2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2
-- ----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, phone, password_hash, role, created_at, updated_at) VALUES
(1, 'Administrator', 'admin@gymkhana.com', '+91 98765 00001', '$2a$10$xJWQc50Wv788/YRet/XO9e7UX4n8lMLAaex/uYB3Tb4NMWkg0FHuK', 'ADMIN', '2026-01-01 08:00:00', '2026-01-01 08:00:00'),
(2, 'Coach Vikram Malhotra', 'trainer@gymkhana.com', '+91 98765 00002', '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', 'TRAINER', '2026-01-02 09:00:00', '2026-01-02 09:00:00'),
(3, 'Coach Ananya Roy', 'ananya.trainer@gymkhana.com', '+91 98765 00003', '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', 'TRAINER', '2026-01-03 09:00:00', '2026-01-03 09:00:00'),
(4, 'Coach Kabir Singh', 'kabir.trainer@gymkhana.com', '+91 98765 00004', '$2a$10$nBY7uOrlswFdvi3eOuuHzuAfKixEcHT2o5lsMRc8ckhQQfp2uqICm', 'TRAINER', '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
(5, 'Rahul Sharma', 'member1@gymkhana.com', '+91 98765 11111', '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', 'MEMBER', '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
(6, 'Priya Verma', 'member2@gymkhana.com', '+91 98765 22222', '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', 'MEMBER', '2026-01-15 11:00:00', '2026-01-15 11:00:00'),
(7, 'Amit Kumar', 'member3@gymkhana.com', '+91 98765 33333', '$2a$10$NTHJv8Hr01rK/9QsiyCKt.0zg/UI5nXwOxCxqkI2MzMw.lU202iX2', 'MEMBER', '2026-02-01 10:30:00', '2026-02-01 10:30:00');

-- ----------------------------------------------------------------------------
-- 2. MEMBERSHIPS
-- ----------------------------------------------------------------------------
INSERT INTO memberships (id, name, duration_months, price, features, access_details, created_at) VALUES
(1, 'Basic Monthly Pass', 1, 1500.00, 
 'Full floor gym floor access\nStandard locker room & shower access\nGeneral fitness orientation tour\nWater dispenser & towel service',
 'Floor access Monday to Saturday 06:00 to 22:00. Peak and off-peak hours unrestricted.',
 '2026-01-01 00:00:00'),
(2, 'Standard 6-Month Pass', 6, 7500.00,
 'Full floor gym floor & free weights area\n1 Complimentary trainer consultation session\nMonthly biometric body composition scan\nAccess to all periodized public training plans\nPriority locker facilities',
 'Unlimited 7-day facility access Monday through Sunday with full equipment privileges.',
 '2026-01-01 00:00:00'),
(3, 'Elite Annual Athletic Pass', 12, 13500.00,
 'Full 365-day unrestricted facility access\nDedicated floor coach assignment\nBi-weekly biometric progress check-ins\nTailored workout plan structuring\nFree guest passes (2 per quarter)\nSauna & recovery zone access',
 'Complete facility access with dedicated locker storage and priority coaching attention.',
 '2026-01-01 00:00:00');

-- ----------------------------------------------------------------------------
-- 3. TRAINERS
-- ----------------------------------------------------------------------------
INSERT INTO trainers (id, user_id, specialization, experience_years, bio, certifications, availability_status) VALUES
(1, 2, 'Strength & Conditioning', 8,
 'Coach Vikram specializes in progressive overload mechanics, Olympic weightlifting foundations, and sport-specific physical preparation.',
 'CSCS (NSCA), USA Weightlifting Level 2, CPR/AED', 'Available'),
(2, 3, 'Hypertrophy & Biomechanics', 5,
 'Coach Ananya focuses on muscular hypertrophy, structural posture alignment, and safe execution cues for natural physique development.',
 'ACSM-CPT, Precision Nutrition Level 1, FMS Level 1', 'Available'),
(3, 4, 'Mobility & Powerlifting', 6,
 'Coach Kabir is a dedicated powerlifting technician focusing on heavy compound barbell mechanics, hip mobility, and injury resilience.',
 'NSCA-CPT, Westside Barbell Special Strengths Coach', 'Available');

-- ----------------------------------------------------------------------------
-- 4. MEMBERS
-- ----------------------------------------------------------------------------
INSERT INTO members (id, user_id, membership_id, trainer_id, join_date, status) VALUES
(1, 5, 2, 1, '2026-01-10', 'ACTIVE'),
(2, 6, 3, 2, '2026-01-15', 'ACTIVE'),
(3, 7, 1, NULL, '2026-02-01', 'ACTIVE');

-- ----------------------------------------------------------------------------
-- 5. EQUIPMENT (12 Authentic Facility Machines)
-- ----------------------------------------------------------------------------
INSERT INTO equipment (id, name, category, target_body_part, description, primary_purpose, benefits, how_to_use, safety_instructions, image_url, created_at) VALUES
(1, 'Olympic Barbell & Power Rack Station', 'Free Weights / Benches', 'Full Body',
 'Heavy-duty steel rack with adjustable J-hooks, knurled safety spotter arms, and standardized 20kg Olympic barbells.',
 'Foundation compound movements: Squats, Bench Press, and Overhead Press',
 'Enables high-load multi-joint compound lifting with full self-spotting capability.\nAccommodates all human anthropometries through precision pin holes.\nDevelops structural bone density and functional kinetic power.',
 'Step 1: Adjust J-hooks to armpit height.\nStep 2: Set safety spotter arms just below the bottom range of your movement.\nStep 3: Load Olympic plates evenly on both sleeves and lock with barbell collars.\nStep 4: Unrack with an active core, perform prescribed repetitions, and re-rack under control.',
 'Never train heavy compound lifts without securing weight collars on both sides.\nAlways adjust safety arms before loading weights.\nDo not bounce the bar off safety rails.',
 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(2, 'Adjustable Dual Cable Crossover', 'Cable Station', 'Full Body',
 'Twin multi-directional adjustable pulley towers with smooth aluminum bearings and standardized weight stacks.',
 'Constant-tension muscular isolation across arbitrary planes of motion',
 'Delivers uniform tension through both eccentric and concentric phases.\nDual pulleys permit bilateral chest flyes, cable rows, face pulls, and tricep pressdowns.\nMinimal shear force on joints compared to fixed levers.',
 'Step 1: Release the spring-loaded carriage pin and slide the pulley to target height.\nStep 2: Attach selected handle attachment (D-handle, rope, straight bar).\nStep 3: Insert weight selector pin firmly into the desired plate increment.\nStep 4: Step out into tension with a staggered athletic stance.',
 'Always verify the carriage locking pin has fully clicked into the vertical column hole.\nDo not let weight stacks slam together at the completion of repetitions.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(3, '45-Degree Plate-Loaded Leg Press', 'Plate-Loaded Machine', 'Legs',
 'Heavy commercial linear leg press carriage riding on hardened steel guide rods with triple lockout positions.',
 'High-load quadriceps, hamstring, and gluteal hypertrophy with spinal unloading',
 'Allows maximal lower body loading without axial spinal compression.\nMultiple foot placement variations isolate quad sweep or posterior chain.\nBuilt-in secondary safety catches prevent carriage overrun.',
 'Step 1: Sit firmly into seat with lower back and sacrum pressed flat against back pad.\nStep 2: Place feet shoulder-width on footplate.\nStep 3: Press carriage upward slightly to disengage safety lock handles.\nStep 4: Lower carriage under control until knees reach 90 degrees, then drive through midfoot.\nStep 5: Re-engage lockout levers before removing feet.',
 'Never lock your knees out forcefully at the top of the movement.\nKeep lower back glued to the back pad throughout execution to prevent pelvic tilting.',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(4, 'Seated Lat Pulldown & Low Row Combo', 'Pin-Selected Machine', 'Back',
 'Dual-purpose vertical pull and horizontal cable station equipped with adjustable thigh hold-down rollers.',
 'Latissimus dorsi and scapular retractor muscular development',
 'Reinforces vertical pulling mechanics for trainees building up to bodyweight pull-ups.\nQuick-adjust thigh pads ensure athlete stability during heavy working sets.',
 'Step 1: Adjust thigh pad so thighs fit securely with feet flat on the floor.\nStep 2: Select desired weight on stack.\nStep 3: Grasp wide bar with overhand grip.\nStep 4: Pull bar smoothly to upper clavicle while depressing scapulae.\nStep 5: Control the return to full overhead stretch.',
 'Avoid swinging torso backward to jerk momentum into the weight.\nDo not pull the bar behind the neck to protect cervical vertebrae.',
 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(5, 'Seated Leg Extension Machine', 'Pin-Selected Machine', 'Legs',
 'Precision cam-driven knee extension station designed to isolate the quadriceps femoris.',
 'Quadriceps isolation and patellar tendon conditioning',
 'Direct rectus femoris and vastus lateralis stimulation.\nAdjustable backrest and tibia roller pad accommodate varying limb lengths.',
 'Step 1: Align knee joint pivot axis directly with machine cam rotational axis.\nStep 2: Adjust shin pad to sit right above the ankle joint.\nStep 3: Extend knees until legs are parallel to floor, pausing momentarily at peak contraction.\nStep 4: Lower weight stack smoothly in 2-3 seconds.',
 'Do not kick or propel weight with momentum.\nAvoid hyper-extending the knee joint forcefully.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(6, 'Prone Leg Curl Machine', 'Pin-Selected Machine', 'Legs',
 'Ergonomically contoured prone bench providing targeted knee flexion for hamstring isolation.',
 'Knee flexor hamstring isolation without lumbar strain',
 'Direct stimulation of biceps femoris, semitendinosus, and semimembranosus.\nAngled prone pad places pelvis in optimal anterior tilt.',
 'Step 1: Lie face down and position Achilles tendons beneath the roller pad.\nStep 2: Grasp forward stabilization handles.\nStep 3: Curl heels toward glutes in a controlled arc.\nStep 4: Pause briefly at peak knee flexion, then lower with control.',
 'Do not lift hips off the bench while curling weight upward.\nMaintain neutral foot alignment without excessive toe pointing.',
 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(7, 'Seated Chest Press Station', 'Pin-Selected Machine', 'Chest',
 'Converging-axis chest press machine with foot-assisted start pedal and multi-grip handles.',
 'Pectoralis major and anterior deltoid hypertrophy with fixed trajectory',
 'Converging motion mimics natural human dumbbell pressing path.\nIntegrated foot lever allows smooth unracking and re-racking of heavy weights.',
 'Step 1: Adjust seat height so handles align with mid-chest level.\nStep 2: Press foot pedal to bring handles forward into starting grip position.\nStep 3: Push handles forward while retracting shoulder blades against the pad.\nStep 4: Return slowly until chest feels an active stretch, then press.',
 'Keep wrists neutral and aligned with forearms.\nDo not round shoulders forward off the backrest at lockout.',
 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(8, 'Dumbbell Free Weight Complex (2.5kg - 50kg)', 'Free Weights / Benches', 'Full Body',
 'Commercial urethane-encased solid steel dumbbells arranged chronologically on heavy-duty tiered saddles.',
 'Unilateral balance, joint stabilizer recruitment, and multi-planar movements',
 'Corrects muscular asymmetries between left and right limbs.\nEnables natural rotational mechanics for wrists, elbows, and shoulders.\nUniversal versatility across presses, rows, lunges, and curls.',
 'Step 1: Choose matching pair corresponding to prescribed resistance.\nStep 2: Lift dumbbells off rack using hip hinge mechanics, never with a rounded spine.\nStep 3: Execute movement through full range of motion under strict tempo.\nStep 4: Return dumbbells to their labeled rack saddle immediately after set completion.',
 'Never drop or bounce urethane dumbbells on the gym floor.\nAlways re-rack dumbbells in correct weight order.',
 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(9, 'Seated Cable Row Station', 'Cable Station', 'Back',
 'Low horizontal pulley station with non-slip foot braces and versatile carabiner attachment point.',
 'Middle back thickness, rhomboid retraction, and latissimus development',
 'Encourages stable horizontal pulling without taxing lower back stability.\nSupports multiple attachments: close-grip V-bar, wide bar, single-arm handles.',
 'Step 1: Sit on bench, place feet securely on forward foot braces with knees slightly bent.\nStep 2: Grasp handle and sit upright with a braced, neutral spine.\nStep 3: Pull attachment into lower abdomen while pulling shoulder blades back.\nStep 4: Extend arms forward under control to feel full lat stretch.',
 'Do not violently rock torso backward and forward during repetitions.\nMaintain slight knee bend to prevent hamstring overstretching.',
 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(10, 'Standing Calf Raise Station', 'Pin-Selected Machine', 'Legs',
 'Vertical loading column with contoured shoulder pads and slip-resistant elevated ball-of-foot block.',
 'Gastrocnemius and soleus hypertrophy and ankle plantarflexion strength',
 'Full plantarflexion and dorsiflexion range of motion over an elevated block.\nPadded shoulder rests eliminate grip fatigue limitations.',
 'Step 1: Place balls of feet on platform with heels hanging freely.\nStep 2: Position shoulders comfortably under padded levers and stand erect.\nStep 3: Lower heels into deep calf stretch.\nStep 4: Press forcefully through balls of feet to maximum elevation, pausing at top.',
 'Do not bounce rapidly at the bottom of the stretch.\nKeep knees slightly soft to avoid hyperextension under vertical loads.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(11, 'Preacher Curl Arm Station', 'Free Weights / Benches', 'Arms',
 'Contoured 45-degree arm support bench with integrated barbell cradle for bicep isolation.',
 'Complete biceps brachii isolation by eliminating shoulder movement and momentum',
 'Eliminates cheat mechanics by locking upper arm against high-density foam pad.\nMaximizes tension on the short and long bicep heads.',
 'Step 1: Adjust seat so armpits rest snugly against top of the angled pad.\nStep 2: Grasp EZ-curl bar with shoulder-width underhand grip.\nStep 3: Curl bar upward toward chin without lifting elbows off pad.\nStep 4: Lower bar under control until arms are almost fully extended.',
 'Never abruptly hyperextend elbows at the bottom of the movement.\nDo not lift upper body off seat to heave the weight.',
 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(12, 'Commercial Flat / Incline / Decline (FID) Bench', 'Free Weights / Benches', 'Chest',
 'Multi-angle steel utility bench with laser-cut angle adjustment notches ranging from -15 to +85 degrees.',
 'Platform foundation for all dumbbell pressing, seated rows, and arm work',
 'Sturdy 450kg weight rating ensures complete stability during heavy dumbbell work.\nQuick-switch adjustment pin facilitates effortless transition from flat to incline.',
 'Step 1: Pull pop-pin and adjust backrest to target angle (0, 30, 45, or 60 degrees).\nStep 2: Adjust seat angle accordingly to prevent sliding downward.\nStep 3: Ensure locking pin is fully seated in notch before sitting.',
 'Inspect locking pin engagement before sitting with heavy dumbbells.\nKeep head, shoulders, and hips in steady contact with bench upholstery.',
 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00');

-- ----------------------------------------------------------------------------
-- 6. EXERCISES (21 Comprehensive Exercises spanning all muscle groups)
-- ----------------------------------------------------------------------------
INSERT INTO exercises (id, name, body_part, category, difficulty, equipment_id, description, instructions, benefits, safety_tips, common_mistakes, image_url, created_at) VALUES
(1, 'Barbell Back Squat', 'Legs', 'Compound', 'Intermediate', 1,
 'The premier compound lower-body exercise recruiting the quadriceps, adductors, gluteus maximus, and spinal erectors.',
 'Set barbell on J-hooks at mid-chest height.\nStep under bar and pin it across upper trapezius with hands gripping outside shoulders.\nUnrack bar, take two calculated steps back, and establish shoulder-width foot position.\nInhale deeply, brace abdominal wall, and sit back and down into hips.\nDescend until hip crease is below knee level.\nDrive forcefully through mid-foot to stand erect.',
 'Develops full lower body explosive power and functional strength.\nStimulates systemic endocrine adaptation.\nStrengthens lumbar spine and core stability.',
 'Keep knees tracking in line with toes.\nMaintain a rigid neutral lumbar posture.\nAlways squat inside a rack with safety pins deployed.',
 'Allowing knees to cave inward during ascent.\nRounding the lumbar spine at bottom of squat.\nRising onto toes rather than mid-foot balance.',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(2, 'Barbell Bench Press', 'Chest', 'Compound', 'Intermediate', 1,
 'Fundamental horizontal pressing movement building pectoralis major mass, anterior deltoid density, and tricep extension strength.',
 'Lie flat on bench with eyes positioned directly under the racked bar.\nRetract and depress shoulder blades into the bench pad.\nGrasp bar with overhand grip slightly wider than shoulder width.\nUnrack bar, stabilize over sternum, and inhale deeply.\nLower bar in a controlled path to touch mid-chest.\nPress bar upward and slightly back toward eye line until arms extend.',
 'Maximizes upper body horizontal pressing force production.\nBuilds anterior upper-body muscular thickness.\nHigh carryover to athletic pushing movements.',
 'Keep feet planted firmly into the floor.\nDo not flare elbows perpendicular to torso.\nMaintain tight scapular retraction throughout.',
 'Bouncing the barbell violently off sternum.\nFlaring elbows outward at 90 degrees putting rotator cuffs at risk.\nLifting hips off the bench surface.',
 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(3, 'Conventional Barbell Deadlift', 'Back', 'Compound', 'Advanced', 1,
 'The ultimate posterior chain test targeting hamstrings, gluteals, latissimus dorsi, and spinal erectors from a dead stop.',
 'Stand with mid-foot directly under the barbell with hip-width stance.\nHinge at hips and grip barbell just outside shins.\nPull chest up, drop hips slightly, and engage lats to remove bar slack.\nTake a deep intra-abdominal breath and brace core.\nDrive through the floor, extending knees and hips simultaneously.\nLock out hips at top without hyperextending lower back.\nReturn bar to floor by hinging hips back.',
 'Develops unbreakable posterior chain and spinal erector strength.\nMassive forearm grip and trapezius hypertrophy.\nSuperior carryover to functional lifting in daily life.',
 'Do not yank bar aggressively off the floor.\nKeep barbell in continuous contact with legs throughout the pull.\nNever round the lumbar spine.',
 'Rounding lower back like a fishing rod under load.\nHitching or bouncing the barbell off thighs.\nHyperextending lumbar spine excessively at lockout.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(4, 'Overhead Barbell Military Press', 'Shoulders', 'Compound', 'Intermediate', 1,
 'Strict standing vertical press building medial and anterior deltoid strength, triceps, and upper-chest clavicular head.',
 'Position bar at collarbone level with shoulder-width overhand grip.\nStep away from rack with glutes squeezed and abs braced.\nPress barbell vertically upward, moving head back slightly to clear bar path.\nLock out bar overhead with biceps aligned with ears.\nLower bar under control back to clavicle.',
 'Builds round, cannonball shoulder deltoids.\nDemands total core and glute stabilization without a backrest.\nImproves scapular upward rotation health.',
 'Keep ribcage tucked down to prevent excessive lumbar arching.\nSqueeze glutes hard throughout the entire press.',
 'Leaning back excessively to turn it into an incline bench press.\nPushing bar too far forward away from center of gravity.\nBouncing with knee dip.',
 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(5, 'Wide-Grip Lat Pulldown', 'Back', 'Compound', 'Beginner', 4,
 'Vertical pulling exercise targeting the latissimus dorsi width and teres major.',
 'Sit upright with thighs anchored under roller pads.\nGrasp bar with overhand grip wider than shoulders.\nDepress shoulder blades down and pull bar smoothly to collarbone.\nSqueeze lats hard at bottom position.\nSlowly extend arms overhead to feel deep lat stretch.',
 'Broadens upper back creating classic athletic V-taper.\nSafe progression path for athletes unable to perform bodyweight pull-ups.\nMinimal strain on lower back.',
 'Keep torso upright with slight 10-degree natural lean.\nLead the pull with elbows driving downward.',
 'Yanking body backward to 45 degrees using momentum.\nPulling bar down to stomach instead of clavicle.\nShrugging shoulders into ears at contraction.',
 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(6, 'Incline Dumbbell Bench Press', 'Chest', 'Compound', 'Intermediate', 12,
 'Incline press on a 30-degree utility bench prioritizing the clavicular head of pectoralis major and anterior deltoids.',
 'Set adjustable bench to 30 degrees angle.\nSit with dumbbells resting on knees, then kick weights back to shoulders as you lie flat.\nRetract shoulder blades and plant feet firmly on the floor.\nPress dumbbells upward in a slight converging arc.\nLower dumbbells slowly until elbows are level with torso.',
 'Fills out the upper chest region under collarbone.\nAllows independent wrist and elbow freedom reducing shoulder impingement.\nBuilds unilateral shoulder stability.',
 'Avoid setting bench angle above 45 degrees to avoid excessive front delt dominance.\nKeep wrists stacked directly over elbows.',
 'Setting incline too steep (60 degrees) turning exercise into shoulder press.\nCollapsing chest and letting shoulder blades unlock.\nDropping weights abruptly.',
 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(7, 'Seated Cable Row', 'Back', 'Compound', 'Beginner', 9,
 'Horizontal cable row targeting middle trapezius, rhomboid retraction, and lat thickness.',
 'Sit upright on bench with feet flat on footrests and knees slightly bent.\nGrasp V-grip handle with neutral grip.\nBrace core, sit tall, and pull handle toward belly button.\nRetract shoulder blades forcefully at peak contraction.\nReturn slowly forward until arms reach full extension.',
 'Builds back thickness and reinforces upright posture.\nCounteracts forward shoulder slump from desk work.\nVery safe on lower back.',
 'Keep chest proud and shoulders pulled away from ears.\nDo not let knees lock out completely.',
 'Swinging upper body backward and forward like a rowing rower.\nRounding thoracic spine at release.\nUsing biceps instead of back muscles to pull.',
 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(8, '45-Degree Leg Press', 'Legs', 'Compound', 'Beginner', 3,
 'Machine compound movement for massive lower body quadriceps, glute, and hamstring development.',
 'Sit in machine with lower back firmly pinned against pad.\nPlace feet shoulder-width in middle of footplate.\nRelease safety lockout levers with handles.\nLower carriage smoothly until knees achieve 90-degree flexion.\nDrive through whole foot to press carriage back up without locking knees.',
 'Allows intense quad overload without spinal balance constraints.\nAdjustable foot placements target quads or glutes specifically.\nBuilt-in safety catches.',
 'Never allow lower back to lift or round away from back pad.\nMaintain controlled 3-second lowering cadence.',
 'Locking out knees aggressively causing joint hyperextension.\nPlacing feet too low causing severe knee overhang.\nLifting pelvis off pad.',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(9, 'Dumbbell Romanian Deadlift (RDL)', 'Legs', 'Compound', 'Intermediate', 8,
 'Hip-hinge movement maximizing eccentric hamstring tension and gluteal contraction.',
 'Stand tall holding a pair of dumbbells in front of thighs.\nEstablish hip-width stance with knees slightly unlocked.\nPush hips back as if trying to touch wall behind you with tailbone.\nLower dumbbells along shins while maintaining flat spine.\nPause at mid-shin when hamstrings reach deep stretch.\nDrive hips forward to return to standing position.',
 'Tremendous hamstring muscle fiber growth via eccentric loading.\nStrengthens hip hinge pattern for better athletic sprint power.\nDevelops gluteal-hamstring tie-in.',
 'Keep dumbbells skimming close to legs throughout.\nDo not squat down; push hips backward horizontally.',
 'Rounding spine to reach dumbbells to floor.\nBending knees into a squat rather than a hip hinge.\nHyperextending lower back at top.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(10, 'Standing Dumbbell Lateral Raise', 'Shoulders', 'Isolation', 'Beginner', 8,
 'Medial deltoid isolation exercise creating width and definition across the shoulders.',
 'Stand tall with dumbbells held at sides with slight forward torso lean.\nBend elbows slightly (10-15 degrees).\nRaise dumbbells out to sides until elbows reach shoulder height.\nLead with elbows and keep pinkies slightly elevated.\nLower weights with strict 2-second control.',
 'Builds shoulder width and clavicular silhouette.\nIsolates lateral head without front delt dominance.\nLightweight high-rep muscle stimulation.',
 'Do not use hip swing or knee bounce to initiate movement.\nKeep thumbs slightly lower than pinkies.',
 'Using heavy weights and swinging hips violently.\nRaising hands higher than elbows.\nShrugging traps to lift weights.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(11, 'Seated Leg Extension', 'Legs', 'Isolation', 'Beginner', 5,
 'Direct quadriceps isolation machine targeting all four heads with concentrated peak contraction.',
 'Sit in machine with back pad adjusted so knee joint aligns with machine pivot.\nPosition shin pad comfortably above ankle joints.\nExtend legs upward until fully straight, pausing 1 second at top.\nLower weight smoothly without letting stack slam.',
 'Direct rectus femoris and vastus medialis isolation.\nIdeal for quad pump and knee rehab protocols.\nZero balance requirement.',
 'Keep hips pressed firmly into seat using side handles.\nControl eccentric lowering phase.',
 'Kicking weight up fast with ballistic momentum.\nAdjusting pad too high up on shins.\nLifting body out of seat.',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(12, 'Prone Lying Leg Curl', 'Legs', 'Isolation', 'Beginner', 6,
 'Direct knee-flexor hamstring isolation targeting biceps femoris and semitendinosus.',
 'Lie prone on bench with knees just below edge of pad.\nPosition ankle pad against lower calf / Achilles tendon.\nGrasp handles and keep hips flat on bench.\nCurl heels upward toward glutes until full knee flexion.\nLower weight in a 3-second eccentric tempo.',
 'Provides dedicated knee-flexion hamstring work complementary to hip-hinges.\nProtects anterior cruciate ligament (ACL) stability.\nDirect posterior thigh muscle pump.',
 'Keep hips flat on pad throughout repetition.\nDo not arch lumbar spine to generate leverage.',
 'Lifting hips high in the air while curling.\nJerking weights with lower back momentum.\nLetting weights slam at bottom.',
 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(13, 'Standing Cable Face Pull', 'Shoulders', 'Isolation', 'Beginner', 2,
 'Crucial postural health exercise targeting rear deltoids, rotator cuff external rotators, and lower traps.',
 'Set cable pulley at upper chest / eye level with rope attachment.\nGrasp rope with thumbs pointing backward.\nStep back into athletic split stance.\nPull rope toward nose while rotating knuckles backward.\nSqueeze rear shoulders and shoulder blades for 1 second.\nReturn smoothly under tension.',
 'Counteracts rounded forward-shoulder posture.\nStrengthens infraspinatus and teres minor rotator cuff muscles.\nEssential injury-prevention tool for bench pressers.',
 'Focus on external rotation at peak of movement.\nKeep elbows high and wide.',
 'Pulling down toward throat like a row instead of face.\nUsing too much weight and leaning backward.\nDropping elbows down.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(14, 'Dumbbell Hammer Curl', 'Arms', 'Isolation', 'Beginner', 8,
 'Neutral-grip arm curl isolating the brachialis and brachioradialis for forearm and arm thickness.',
 'Stand tall holding dumbbells with neutral palms-facing-each-other grip.\nKeep elbows pinned closely against ribs.\nCurl dumbbells upward toward shoulders while maintaining neutral grip.\nSqueeze peak contraction at top.\nLower dumbbells with controlled 2-second tempo.',
 'Builds the brachialis muscle under biceps, pushing bicep peak higher.\nThickens forearms and enhances grip strength.\nMore joint-friendly on wrists than straight bar curls.',
 'Do not swing elbows forward away from torso.\nKeep wrists rigid and aligned.',
 'Swinging torso backward to heave heavy weights.\nFlaring elbows outward away from body.\nRotating palms up halfway.',
 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(15, 'Tricep Rope Cable Pushdown', 'Arms', 'Isolation', 'Beginner', 2,
 'Constant-tension tricep cable isolation emphasizing the lateral and medial heads.',
 'Attach rope attachment to high cable pulley.\nGrasp rope and step back slightly with knees soft.\nPin elbows to sides and tuck them against ribs.\nPush rope downward, spreading ends apart at bottom lockout.\nPause for peak tricep contraction.\nReturn hands slowly to chest level.',
 'Constant cable tension throughout entire range of motion.\nSpreading rope at bottom fully recruits lateral tricep head.\nSafe on elbow tendons.',
 'Keep upper arms fixed like statues.\nDo not lean heavy bodyweight over the rope.',
 'Flaring elbows outward and turning it into a press.\nUsing shoulder movement to move the cable.\nLetting weights slam between reps.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(16, 'Barbell EZ-Curl Preacher Curl', 'Arms', 'Isolation', 'Intermediate', 11,
 'Strict bicep isolation locking upper arm against angled preacher pad to eliminate body swing.',
 'Sit at preacher bench with armpits snug against top pad.\nGrasp EZ-bar on inner camber with underhand grip.\nLower bar under control until arms are almost fully straight.\nCurl bar upward by flexing biceps.\nSqueeze bicep peak at top without lifting elbows off pad.',
 'Eliminates all momentum forcing biceps to perform 100% of the work.\nIsolates the short inner head of the biceps.\nDevelops deep bicep definition.',
 'Never abruptly bounce at the bottom extension.\nKeep wrists straight and rigid.',
 'Lifting body off seat to initiate curl.\nDropping bar fast risking distal bicep strain.\nShrugging shoulders.',
 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(17, 'Hanging Knee / Leg Raise', 'Core', 'Isolation', 'Intermediate', 1,
 'Functional hanging core exercise strengthening the rectus abdominis, hip flexors, and grip.',
 'Hang from pull-up bar with overhand grip slightly wider than shoulders.\nDepress shoulders and engage lats to eliminate swinging.\nCurl knees upward toward chest, rounding pelvis forward.\nPause for 1 second at top contraction.\nLower legs under control back to starting dead hang.',
 'Develops lower abdominal wall strength and pelvic control.\nDecompresses spinal column while hanging.\nBuilds forearm grip endurance.',
 'Roll pelvis upward at top of repetition to activate abdominals.\nDo not swing legs with momentum.',
 'Swinging body back and forth using pendulum momentum.\nOnly flexing hips without curling pelvis forward.\nShrugging shoulders into ears.',
 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(18, 'Plank with Core Bracing', 'Core', 'Isolation', 'Beginner', NULL,
 'Isometric core stability pillar testing rectus abdominis, transverse abdominis, and glutes.',
 'Place forearms on floor with elbows directly below shoulders.\nExtend legs behind with toes tucked onto floor.\nSqueeze glutes, tuck pelvis, and brace abdominal wall as if anticipating a punch.\nHold rigid straight line from head to heels for prescribed duration.\nBreathe rhythmically without dropping hips.',
 'Develops anti-extension spinal stability.\nStrengthens deep transverse abdominal core girdle.\nProtects lumbar spine during heavy standing compound lifts.',
 'Keep head neutral looking down at hands.\nDo not hold breath.',
 'Sagging hips toward the floor placing shearing load on lumbar spine.\nPiking hips high in the air.\nHyperextending cervical spine looking upward.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(19, 'Standing Machine Calf Raise', 'Legs', 'Isolation', 'Beginner', 10,
 'Direct calf gastrocnemius hypertrophy training over an elevated deficit block.',
 'Place shoulder pads comfortably over traps and stand upright.\nPosition balls of feet on elevated block with heels hanging off.\nLower heels deeply into full calf stretch.\nDrive through big toes to elevate heels as high as possible.\nPause 2 seconds at peak contraction before lowering.',
 'Direct gastrocnemius muscle growth.\nStrengthens Achilles tendon elasticity and running mechanics.\nIncreases ankle dorsiflexion mobility.',
 'Execute with strict pause at bottom stretch to eliminate Achilles bounce.\nKeep knees slightly soft.',
 'Bouncing rapidly up and down like a pogo stick.\nCutting range of motion short.\nRolling onto outside of feet.',
 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(20, 'Dumbbell Walking Lunge', 'Legs', 'Compound', 'Intermediate', 8,
 'Dynamic unilateral lower body movement training quads, glutes, core stability, and hip balance.',
 'Stand tall holding a pair of dumbbells at sides.\nTake a controlled step forward with right leg.\nDrop back knee downward until it gently taps the floor.\nFront shin should remain nearly vertical.\nDrive through right front heel to stand up and step forward with left leg.\nAlternate smoothly across floor.',
 'Superb unilateral leg hypertrophy and balance conditioning.\nStretches hip flexors of the trailing leg.\nHigh metabolic cardiovascular output.',
 'Keep torso upright with braced core.\nDo not let front knee collapse inward.',
 'Banging trailing knee violently onto hard floor.\nTaking steps that are too short jamming front knee.\nLeaning torso heavily forward.',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00'),

(21, 'Cable Chest Flye', 'Chest', 'Isolation', 'Intermediate', 2,
 'Continuous tension horizontal adduction movement isolating pectoralis major fibers.',
 'Set cable pulleys at chest height with D-handles.\nGrasp handles, step forward into staggered stance, and bend elbows slightly.\nBring hands together in wide hugging arc until knuckles touch in front of chest.\nSqueeze inner chest hard at peak contraction.\nOpen arms back under control to feel deep pectoral stretch.',
 'Constant tension across entire range of motion.\nSafely isolates chest without tricep exhaustion.\nHigh mind-muscle connection.',
 'Keep elbow bend fixed throughout movement.\nDo not let hands travel behind shoulders during stretch.',
 'Turning flye into a pressing motion by pushing from elbows.\nUsing too much weight causing shoulders to round forward.\nLetting cables pull arms too far back.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', '2026-01-01 00:00:00');

-- ----------------------------------------------------------------------------
-- 7. WORKOUT PLANS (5 Periodized Programs)
-- ----------------------------------------------------------------------------
INSERT INTO workout_plans (id, name, goal, difficulty, duration_weeks, description, created_by, created_at) VALUES
(1, 'Push-Pull-Legs (PPL) Hypertrophy Split', 'Muscle Building', 'Intermediate', 12,
 'A periodized 3-day split designed for maximal muscular hypertrophy. Days are logically divided into upper-body pushing mechanics, upper-body pulling mechanics, and lower-body development.',
 1, '2026-01-05 10:00:00'),

(2, 'Beginner Foundation Strength Program', 'Strength', 'Beginner', 8,
 'An introductory linear progression routine establishing fundamental motor patterns, compound barbell proficiency, and general physical preparedness.',
 1, '2026-01-06 10:00:00'),

(3, 'Upper-Lower Powerbuilding System', 'Strength', 'Advanced', 10,
 'A high-intensity split combining heavy compound barbell lifts for maximal strength with targeted hypertrophy volume for dense muscular development.',
 2, '2026-01-07 10:00:00'),

(4, 'Full-Body Athletic Conditioning', 'General Fitness', 'Intermediate', 6,
 'A high-density training regimen utilizing compound movements, unilateral exercises, and metabolic core circuits to elevate cardiovascular stamina and lean muscle mass.',
 3, '2026-01-08 10:00:00'),

(5, 'Functional Core & Mobility Protocol', 'General Fitness', 'Beginner', 4,
 'A restorative routine focusing on thoracic extension, hip mobility, spinal anti-extension, and posterior chain endurance.',
 2, '2026-01-09 10:00:00');

-- ----------------------------------------------------------------------------
-- 8. WORKOUT PLAN EXERCISES (Prescribed Daily Routines with Sets, Reps, Rest)
-- ----------------------------------------------------------------------------
-- Plan 1: Push-Pull-Legs
INSERT INTO workout_plan_exercises (plan_id, exercise_id, day_or_order, sets, reps, rest_seconds, notes) VALUES
(1, 2, 'Day 1: Push (Chest, Delts, Triceps)', 4, '8-10', 90, 'Focus on steady 2-second eccentric lowering.'),
(1, 6, 'Day 1: Push (Chest, Delts, Triceps)', 3, '10-12', 75, 'Set bench at 30 degrees.'),
(1, 10, 'Day 1: Push (Chest, Delts, Triceps)', 4, '12-15', 60, 'Lead with elbows, pause 1 second at top.'),
(1, 15, 'Day 1: Push (Chest, Delts, Triceps)', 3, '12-15', 60, 'Spread rope at bottom lockout.'),
(1, 3, 'Day 2: Pull (Back, Rear Delts, Biceps)', 4, '6-8', 120, 'Reset on floor between each repetition.'),
(1, 5, 'Day 2: Pull (Back, Rear Delts, Biceps)', 3, '10-12', 75, 'Pull bar smoothly to upper clavicle.'),
(1, 13, 'Day 2: Pull (Back, Rear Delts, Biceps)', 3, '15-20', 60, 'Rotate thumbs back to recruit rear delts.'),
(1, 14, 'Day 2: Pull (Back, Rear Delts, Biceps)', 3, '10-12', 60, 'Strict arm curl without torso swinging.'),
(1, 1, 'Day 3: Legs & Core', 4, '6-8', 120, 'Descend below parallel with midfoot balance.'),
(1, 8, 'Day 3: Legs & Core', 3, '10-12', 90, 'Control lowering, do not lock knees.'),
(1, 12, 'Day 3: Legs & Core', 3, '12-15', 60, 'Keep hips firmly against bench.'),
(1, 17, 'Day 3: Legs & Core', 3, '12-15', 60, 'Curl pelvis upward at peak.');

-- Plan 2: Beginner Foundation Strength
INSERT INTO workout_plan_exercises (plan_id, exercise_id, day_or_order, sets, reps, rest_seconds, notes) VALUES
(2, 1, 'Session A', 3, '5', 120, 'Establish comfortable stance and depth.'),
(2, 2, 'Session A', 3, '5', 120, 'Keep wrists stacked and scapulae tight.'),
(2, 7, 'Session A', 3, '8-10', 90, 'Sit tall and squeeze back.'),
(2, 18, 'Session A', 3, '45 sec hold', 60, 'Brace core as a rigid plank.'),
(2, 3, 'Session B', 3, '5', 150, 'Maintain flat neutral spine.'),
(2, 4, 'Session B', 3, '5', 120, 'Strict press without knee bounce.'),
(2, 5, 'Session B', 3, '8-10', 90, 'Control overhead stretch.'),
(2, 14, 'Session B', 3, '10-12', 60, 'Controlled tempo bicep curl.');

-- Plan 3: Upper-Lower Powerbuilding
INSERT INTO workout_plan_exercises (plan_id, exercise_id, day_or_order, sets, reps, rest_seconds, notes) VALUES
(3, 2, 'Day 1: Upper Power', 5, '5', 150, 'Heavy working sets with strict paused touch.'),
(3, 7, 'Day 1: Upper Power', 4, '6-8', 90, 'Heavy close-grip row.'),
(3, 4, 'Day 1: Upper Power', 3, '6-8', 90, 'Standing military press.'),
(3, 16, 'Day 1: Upper Power', 3, '8-10', 60, 'Preacher curl isolation.'),
(3, 1, 'Day 2: Lower Power', 5, '5', 180, 'Heavy back squat series.'),
(3, 9, 'Day 2: Lower Power', 4, '8-10', 90, 'Deep hamstring stretch on RDL.'),
(3, 11, 'Day 2: Lower Power', 3, '12-15', 60, 'Quad peak contraction pump.'),
(3, 19, 'Day 2: Lower Power', 4, '15', 60, '2-second pause at bottom stretch.');

-- Plan 4: Full-Body Athletic Conditioning
INSERT INTO workout_plan_exercises (plan_id, exercise_id, day_or_order, sets, reps, rest_seconds, notes) VALUES
(4, 20, 'Day 1: Athletic Circuit', 3, '12 steps/leg', 60, 'Keep torso upright throughout lunges.'),
(4, 6, 'Day 1: Athletic Circuit', 3, '10-12', 60, 'Incline press with active core.'),
(4, 5, 'Day 1: Athletic Circuit', 3, '10-12', 60, 'Smooth vertical pull.'),
(4, 18, 'Day 1: Athletic Circuit', 3, '60 sec hold', 45, 'Maximum abdominal bracing.');

-- Plan 5: Functional Core & Mobility
INSERT INTO workout_plan_exercises (plan_id, exercise_id, day_or_order, sets, reps, rest_seconds, notes) VALUES
(5, 17, 'Routine 1', 3, '10-12', 60, 'Slow controlled knee raise.'),
(5, 18, 'Routine 1', 3, '45 sec hold', 45, 'Strict pelvic tuck.'),
(5, 13, 'Routine 1', 3, '15', 45, 'External rotator cuff focus.'),
(5, 9, 'Routine 1', 3, '10-12', 60, 'Bodyweight / light dumbbell hip hinge mobility.');

-- ----------------------------------------------------------------------------
-- 9. ATTENDANCE RECORDS (Past 30 Days of Check-ins)
-- ----------------------------------------------------------------------------
INSERT INTO attendance (member_id, date, check_in_time, check_out_time, status) VALUES
(1, '2026-09-01', '06:45 AM', '08:15 AM', 'Present'),
(1, '2026-09-03', '06:50 AM', '08:20 AM', 'Present'),
(1, '2026-09-05', '07:05 AM', '08:35 AM', 'Present'),
(1, '2026-09-08', '06:40 AM', '08:10 AM', 'Present'),
(1, '2026-09-10', '06:55 AM', '08:25 AM', 'Present'),
(1, '2026-09-12', '07:15 AM', '08:45 AM', 'Present'),
(1, '2026-09-15', '06:45 AM', '08:15 AM', 'Present'),
(1, '2026-09-17', '06:50 AM', '08:20 AM', 'Present'),
(1, '2026-09-19', '07:00 AM', '08:30 AM', 'Present'),
(1, '2026-09-22', '06:45 AM', '08:15 AM', 'Present'),
(1, '2026-09-24', '06:50 AM', '08:20 AM', 'Present'),
(1, '2026-09-26', '07:10 AM', '08:40 AM', 'Present'),
(1, '2026-09-29', '06:45 AM', '08:15 AM', 'Present'),
(1, '2026-10-01', '06:55 AM', '08:25 AM', 'Present'),
(1, '2026-10-03', '07:00 AM', '08:30 AM', 'Present'),

(2, '2026-09-16', '05:30 PM', '07:00 PM', 'Present'),
(2, '2026-09-18', '05:45 PM', '07:15 PM', 'Present'),
(2, '2026-09-21', '05:25 PM', '06:55 PM', 'Present'),
(2, '2026-09-23', '05:35 PM', '07:05 PM', 'Present'),
(2, '2026-09-25', '05:40 PM', '07:10 PM', 'Present'),
(2, '2026-09-28', '05:30 PM', '07:00 PM', 'Present'),
(2, '2026-09-30', '05:45 PM', '07:15 PM', 'Present'),
(2, '2026-10-02', '05:30 PM', '07:00 PM', 'Present'),

(3, '2026-09-15', '08:00 AM', '09:15 AM', 'Present'),
(3, '2026-09-17', '08:10 AM', '09:25 AM', 'Present'),
(3, '2026-09-20', '08:05 AM', '09:20 AM', 'Present'),
(3, '2026-09-24', '08:15 AM', '09:30 AM', 'Present'),
(3, '2026-09-27', '08:00 AM', '09:15 AM', 'Present');

-- ----------------------------------------------------------------------------
-- 10. BIOMETRIC PROGRESS RECORDS
-- ----------------------------------------------------------------------------
INSERT INTO progress (member_id, measured_on, weight_kg, height_cm, bmi, notes) VALUES
(1, '2026-01-10', 82.50, 178.00, 26.0, 'Baseline onboarding assessment. Target: lean mass development and sub-15% body fat.'),
(1, '2026-03-15', 80.20, 178.00, 25.3, 'Significant reduction in waist circumference. Squat and bench press numbers trending upward.'),
(1, '2026-06-20', 78.80, 178.00, 24.9, 'Achieved target normal BMI classification. Increased working sets on PPL split.'),
(1, '2026-09-15', 77.50, 178.00, 24.5, 'Excellent athletic composition. Coach Vikram notes improved ankle mobility on squats.'),

(2, '2026-01-15', 68.00, 165.00, 25.0, 'Baseline consultation with Coach Ananya. Focus on posterior chain tone and posture.'),
(2, '2026-04-10', 65.50, 165.00, 24.1, 'Noticeable increase in upper body pulling endurance. Deadlift form pristine.'),
(2, '2026-07-25', 63.80, 165.00, 23.4, 'Consistent adherence to 4-day resistance training split and nutritional goals.'),

(3, '2026-02-01', 88.00, 180.00, 27.2, 'Initial enrollment assessment. Goal: weight loss and cardiovascular reconditioning.'),
(3, '2026-05-10', 84.50, 180.00, 26.1, '3.5 kg fat mass loss recorded on body composition monitor.');

-- ----------------------------------------------------------------------------
-- 11. CONTACT MESSAGES (Public Inquiries and Feedback)
-- ----------------------------------------------------------------------------
INSERT INTO contact_messages (id, name, email, phone, subject, message, is_read, created_at) VALUES
(1, 'Siddharth Joshi', 'siddharth@example.com', '+91 98220 12345', 'Inquiry regarding student semester discounts',
 'Hello GYMKHANA administration, I am an engineering student at the campus and would like to know if there are dedicated student concessions on the 6-month Standard Pass.',
 1, '2026-09-20 14:30:00'),

(2, 'Meera Nambiar', 'meera.n@example.com', '+91 97441 55667', 'Trainer consultation with Coach Ananya',
 'Good afternoon. I am interested in personal biomechanics and posture correction with Coach Ananya Roy. Could you confirm her current training slot availability for morning sessions?',
 0, '2026-09-28 11:15:00'),

(3, 'Rohan Deshmukh', 'rohan.d@example.com', NULL, 'Question on locker room amenities',
 'Hi team, do the facility memberships include dedicated day-lockers and shower kits? Thanks!',
 1, '2026-09-30 16:45:00'),

(4, 'Dr. Sunita Rao', 'sunita.rao@univ.edu', '+91 98111 88990', 'Field Project Evaluation Committee Visit',
 'Greetings. As part of the annual academic evaluation committee, we will be reviewing the GYMKHANA database architecture and role authorization pipelines. Everything looks professionally organized.',
 0, '2026-10-02 09:20:00');
