// const { PrismaClient, Role, ProductStatus, MentorshipStatus, Category } = require('@prisma/client');
// const { hash }  =require('bcrypt');

// const prisma= new PrismaClient();

// async function main() {
//   console.log('Starting seed process...');

//   // Clean existing data (optional, remove if you want to keep existing data)
//   await prisma.mentorship.deleteMany({});
//   await prisma.product.deleteMany({});
//   await prisma.user.deleteMany({});
  
//   console.log('Creating admin users...');
//   // Create admin users
//   const adminPassword = await hash('Admin123!', 10);
//   const admin = await prisma.user.create({
//     data: {
//       email: 'admin@innovatefund.com',
//       password: adminPassword,
//       name: 'Admin User',
//       role: Role.ADMIN,
//       bio: 'Platform administrator with 15+ years of experience in venture capital and startup acceleration.',
//       profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
//       emailVerified: true
//     }
//   });

//   console.log('Creating mentor users...');
//   // Create mentor users
//   const mentors = await Promise.all([
//     prisma.user.create({
//       data: {
//         email: 'sarah.johnson@innovatefund.com',
//         password: await hash('Mentor123!', 10),
//         name: 'Sarah Johnson',
//         role: Role.MENTOR,
//         bio: 'Technology executive with over 20 years of experience in Silicon Valley. Former CTO at TechGiant and advisor to numerous successful startups in the AI and machine learning space.',
//         profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'michael.patel@innovatefund.com',
//         password: await hash('Mentor123!', 10),
//         name: 'Michael Patel',
//         role: Role.MENTOR,
//         bio: 'Healthcare innovation specialist with MD/MBA and 15 years experience scaling health startups. Previously founded MediTech (acquired for $50M) and served as innovation director at Mayo Clinic.',
//         profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'elena.rodriguez@innovatefund.com',
//         password: await hash('Mentor123!', 10),
//         name: 'Elena Rodriguez',
//         role: Role.MENTOR,
//         bio: 'Sustainability expert and serial entrepreneur who has founded three successful eco-friendly consumer goods companies. Specializes in sustainable supply chains and green manufacturing.',
//         profileImage: 'https://randomuser.me/api/portraits/women/7.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'james.wong@innovatefund.com',
//         password: await hash('Mentor123!', 10),
//         name: 'James Wong',
//         role: Role.MENTOR,
//         bio: 'Fintech innovator with background in investment banking and venture capital. Has helped scale multiple fintech startups to unicorn status and specializes in payment solutions and blockchain.',
//         profileImage: 'https://randomuser.me/api/portraits/men/9.jpg',
//         emailVerified: true
//       }
//     })
//   ]);

//   console.log('Creating entrepreneur users...');
//   // Create entrepreneur users
//   const entrepreneurs = await Promise.all([
//     prisma.user.create({
//       data: {
//         email: 'alex.rivera@gmail.com',
//         password: await hash('Password123!', 10),
//         name: 'Alex Rivera',
//         role: Role.ENTREPRENEUR,
//         bio: 'Serial entrepreneur with a passion for educational technology. Previously founded an EdTech startup that helped over 10,000 students improve their learning outcomes.',
//         profileImage: 'https://randomuser.me/api/portraits/men/15.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'priya.sharma@outlook.com',
//         password: await hash('Password123!', 10),
//         name: 'Priya Sharma',
//         role: Role.ENTREPRENEUR,
//         bio: 'Biomedical engineer with 5+ years experience developing healthcare devices. MIT graduate with two patents in wearable medical technology.',
//         profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'david.kim@yahoo.com',
//         password: await hash('Password123!', 10),
//         name: 'David Kim',
//         role: Role.ENTREPRENEUR,
//         bio: 'Sustainable food systems innovator with background in culinary arts and environmental science. Passionate about reducing food waste in the supply chain.',
//         profileImage: 'https://randomuser.me/api/portraits/men/30.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'olivia.chen@gmail.com',
//         password: await hash('Password123!', 10),
//         name: 'Olivia Chen',
//         role: Role.ENTREPRENEUR,
//         bio: 'Software developer and UX designer specializing in AR/VR experiences. Previously worked at Google on immersive technologies.',
//         profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'marcus.wilson@hotmail.com',
//         password: await hash('Password123!', 10),
//         name: 'Marcus Wilson',
//         role: Role.ENTREPRENEUR,
//         bio: 'Financial analyst turned entrepreneur, focused on democratizing investment tools for underserved communities. MBA from Wharton with focus on financial inclusion.',
//         profileImage: 'https://randomuser.me/api/portraits/men/41.jpg',
//         emailVerified: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'leila.mahmoud@gmail.com',
//         password: await hash('Password123!', 10),
//         name: 'Leila Mahmoud',
//         role: Role.ENTREPRENEUR,
//         bio: 'Environmental engineer developing sustainable water filtration technologies. PhD from Stanford with research focus on low-cost water purification methods.',
//         profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
//         emailVerified: true
//       }
//     })
//   ]);

//   console.log('Creating products...');
//   // Create products
//   const products = await Promise.all([
//     // Approved products
//     prisma.product.create({
//       data: {
//         title: 'EduMatch - AI-Powered Personalized Learning Platform',
//         description: 'EduMatch uses machine learning to create personalized learning paths for K-12 students, adapting in real-time to their progress and learning style. Our platform integrates with existing school curricula and provides detailed analytics for teachers and parents to track student growth. Early pilot studies show a 35% improvement in subject mastery compared to traditional teaching methods.',
//         videoUrl: 'https://www.youtube.com/watch?v=y068Jw5ozRE',
//         status: ProductStatus.APPROVED,
//         userId: entrepreneurs[0].id,
//         category: Category.EDUCATION,
//         pitchDeck: 'https://docdro.id/4KDvPll',
//         images: [
//           'https://images.unsplash.com/photo-1610484826967-09c5720778c7',
//           'https://images.unsplash.com/photo-1580582932707-520aed937b7b',
//           'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'
//         ]
//       }
//     }),
//     prisma.product.create({
//       data: {
//         title: 'MediWear - Continuous Health Monitoring Wristband',
//         description: 'MediWear is a medical-grade wearable device that continuously monitors vital health metrics including heart rate, blood oxygen, temperature, and stress levels. Unlike consumer fitness trackers, MediWear is designed to medical standards and can detect early warning signs of health issues. The companion app provides actionable insights and can share data directly with healthcare providers.',
//         videoUrl: 'https://www.youtube.com/watch?v=9XrfmDL1-ls',
//         status: ProductStatus.APPROVED,
//         userId: entrepreneurs[1].id,
//         category: Category.HEALTH,
//         pitchDeck: 'https://docdro.id/V8NvRLk',
//         images: [
//           'https://images.unsplash.com/photo-1557825835-70d97c4aa567',
//           'https://images.unsplash.com/photo-1576086213369-97a306d36557',
//           'https://images.unsplash.com/photo-1559447188-9ebb3fea0fbc'
//         ]
//       }
//     }),
    
//     // Pending products
//     prisma.product.create({
//       data: {
//         title: 'FoodSaver - Smart Food Storage System',
//         description: 'FoodSaver is an IoT-enabled food storage system that monitors food freshness, tracks expiration dates, and provides recipe recommendations based on what you have. Our smart containers use advanced sensors to detect early signs of spoilage and notify users via the app. FoodSaver helps households reduce food waste by up to 60% while saving money on groceries.',
//         videoUrl: 'https://www.youtube.com/watch?v=vGZmgX_KNcs',
//         status: ProductStatus.PENDING,
//         userId: entrepreneurs[2].id,
//         category: Category.FOOD,
//         pitchDeck: 'https://docdro.id/L2Xc5vb',
//         images: [
//           'https://images.unsplash.com/photo-1584473457409-fd55144a5fc2',
//           'https://images.unsplash.com/photo-1583947581924-860bda6a26df',
//           'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf'
//         ]
//       }
//     }),
//     prisma.product.create({
//       data: {
//         title: 'VirtualSpace - AR Workspace Solution',
//         description: 'VirtualSpace transforms any physical space into a customizable AR workspace. Using our lightweight glasses and intuitive gesture control, users can create multiple virtual screens, collaborate with remote team members as if they were in the same room, and organize information spatially. VirtualSpace increases productivity by 40% compared to traditional multi-monitor setups while reducing physical space requirements.',
//         videoUrl: 'https://www.youtube.com/watch?v=jQMqg0uEzB8',
//         status: ProductStatus.PENDING,
//         userId: entrepreneurs[3].id,
//         category: Category.TECHNOLOGY,
//         pitchDeck: 'https://docdro.id/9KvGz4p',
//         images: [
//           'https://images.unsplash.com/photo-1626379953822-baec19c3accd',
//           'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d',
//           'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac'
//         ]
//       }
//     }),
    
//     // Funded products
//     prisma.product.create({
//       data: {
//         title: 'WealthWise - Financial Education Platform',
//         description: 'WealthWise is a comprehensive financial education and investment simulation platform designed for underserved communities. We combine interactive learning modules, personalized financial coaching, and risk-free investment simulations to build financial literacy and confidence. Our pilot program with 500 users showed a 45% increase in savings rates and a 60% improvement in financial knowledge scores.',
//         videoUrl: 'https://www.youtube.com/watch?v=PHe0bXAIuk0',
//         status: ProductStatus.FUNDED,
//         userId: entrepreneurs[4].id,
//         fundingAmount: 750000,
//         category: Category.FINANCE,
//         pitchDeck: 'https://docdro.id/LCM9Vwb',
//         images: [
//           'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
//           'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
//           'https://images.unsplash.com/photo-1553729459-efe14ef6055d'
//         ]
//       }
//     }),
//     prisma.product.create({
//       data: {
//         title: 'AquaPure - Solar-Powered Water Filtration',
//         description: 'AquaPure is a compact, solar-powered water purification system designed for regions with limited access to clean drinking water. Using a combination of advanced membrane technology and UV sterilization, AquaPure can transform contaminated water into safe drinking water at a fraction of the cost of existing solutions. Each unit can provide clean water for up to 100 people daily and has a lifespan of 5+ years with minimal maintenance.',
//         videoUrl: 'https://www.youtube.com/watch?v=AdV9ufQBdvo',
//         status: ProductStatus.FUNDED,
//         userId: entrepreneurs[5].id,
//         fundingAmount: 1200000,
//         category: Category.SUSTAINABILITY,
//         pitchDeck: 'https://docdro.id/SnVcPbc',
//         images: [
//           'https://images.unsplash.com/photo-1581244277943-fe4a9c777189',
//           'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
//           'https://images.unsplash.com/photo-1595501294799-41fc7e778cbe'
//         ]
//       }
//     }),
    
//     // Rejected product
//     prisma.product.create({
//       data: {
//         title: 'CryptoFlex - Cryptocurrency Payment Card',
//         description: 'CryptoFlex is a payment card that allows users to spend their cryptocurrency assets anywhere that accepts traditional payment cards. Our proprietary technology handles real-time conversion at optimal rates, and our app provides detailed transaction history and portfolio management. We aim to bridge the gap between cryptocurrency holdings and everyday purchases.',
//         videoUrl: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
//         status: ProductStatus.REJECTED,
//         userId: entrepreneurs[4].id,
//         category: Category.FINANCE,
//         pitchDeck: 'https://docdro.id/WpX8v2b',
//         images: [
//           'https://images.unsplash.com/photo-1518186285589-2f7649de83e0',
//           'https://images.unsplash.com/photo-1623393937941-c8f28f9bb92a',
//           'https://images.unsplash.com/photo-1563013544-824ae1b704d3'
//         ]
//       }
//     })
//   ]);

//   console.log('Creating mentorships...');
//   // Create mentorships
//   const mentorships = await Promise.all([
//     prisma.mentorship.create({
//       data: {
//         mentorId: mentors[0].id, // Sarah Johnson (tech expert) for EduMatch
//         productId: products[0].id, // EduMatch
//         status: MentorshipStatus.ACTIVE,
//         notes: 'Working with Alex on improving the AI recommendation algorithms and scaling the platform infrastructure. Planning to introduce Alex to potential education sector investors in the next quarter.'
//       }
//     }),
//     prisma.mentorship.create({
//       data: {
//         mentorId: mentors[1].id, // Michael Patel (healthcare specialist) for MediWear
//         productId: products[1].id, // MediWear
//         status: MentorshipStatus.ACTIVE,
//         notes: 'Supporting Priya with FDA compliance strategy and connections to medical device manufacturers. Will assist with clinical trial design in the coming weeks.'
//       }
//     }),
//     prisma.mentorship.create({
//       data: {
//         mentorId: mentors[3].id, // James Wong (fintech expert) for WealthWise
//         productId: products[4].id, // WealthWise
//         status: MentorshipStatus.ACTIVE,
//         notes: 'Advising Marcus on partnership opportunities with financial institutions and refining the monetization model. Need to work on improving user acquisition costs.'
//       }
//     }),
//     prisma.mentorship.create({
//       data: {
//         mentorId: mentors[2].id, // Elena Rodriguez (sustainability expert) for AquaPure
//         productId: products[5].id, // AquaPure
//         status: MentorshipStatus.ACTIVE,
//         notes: 'Working with Leila on manufacturing partnerships in target regions and securing additional grant funding. Planning field tests in three countries over the next six months.'
//       }
//     })
//   ]);

//   console.log(`Database seeded successfully!`);
//   console.log(`Created ${await prisma.user.count()} users`);
//   console.log(`Created ${await prisma.product.count()} products`);
//   console.log(`Created ${await prisma.mentorship.count()} mentorships`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });