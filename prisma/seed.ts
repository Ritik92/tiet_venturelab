// const { PrismaClient, Role, ProductStatus, MentorshipStatus, Category } = require('@prisma/client');
// const bcrypt = require('bcrypt');
// const { faker } = require('@faker-js/faker');
// const Chance = require('chance');

// const prisma = new PrismaClient();
// const chance = new Chance(1); // Use a seed for reproducible results

// async function hashPassword(password) {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// }

// async function main() {
//   console.log('Starting database seeding...');
  
//   // Clear existing data
//   await prisma.mentorship.deleteMany({});
//   await prisma.product.deleteMany({});
//   await prisma.user.deleteMany({});

//   // Create Admin Users (5)
//   const adminPassword = await hashPassword('Admin123!');
//   const adminUsers = [];
  
//   for (let i = 0; i < 5; i++) {
//     const admin = await prisma.user.create({
//       data: {
//         email: `admin${i+1}@example.com`,
//         password: adminPassword,
//         name: faker.person.fullName(),
//         role: Role.ADMIN,
//         emailVerified: true,
//         bio: faker.lorem.paragraph(),
//         profileImage: faker.image.avatar(),
//       },
//     });
//     adminUsers.push(admin);
//   }
//   console.log(`Created ${adminUsers.length} admin users`);

//   // Create Mentor Users (50)
//   const mentorPassword = await hashPassword('Mentor123!');
//   const mentors = [];
  
//   for (let i = 0; i < 50; i++) {
//     const mentor = await prisma.user.create({
//       data: {
//         email: faker.internet.email(),
//         password: mentorPassword,
//         name: faker.person.fullName(),
//         role: Role.MENTOR,
//         emailVerified: faker.datatype.boolean(0.9), // 90% are verified
//         bio: faker.lorem.paragraphs(2),
//         profileImage: faker.image.avatar(),
//         verificationToken: faker.datatype.boolean(0.1) ? faker.string.alphanumeric(32) : null,
//         verificationTokenExpiry: faker.datatype.boolean(0.1) ? faker.date.future() : null,
//       },
//     });
//     mentors.push(mentor);
//   }
//   console.log(`Created ${mentors.length} mentor users`);

//   // Create Entrepreneur Users (200)
//   const entrepreneurPassword = await hashPassword('Entrepreneur123!');
//   const entrepreneurs = [];
  
//   for (let i = 0; i < 200; i++) {
//     const entrepreneur = await prisma.user.create({
//       data: {
//         email: faker.internet.email(),
//         password: entrepreneurPassword,
//         name: faker.person.fullName(),
//         role: Role.ENTREPRENEUR,
//         emailVerified: faker.datatype.boolean(0.8), // 80% are verified
//         bio: faker.lorem.paragraph(),
//         profileImage: faker.image.avatar(),
//         verificationToken: faker.datatype.boolean(0.2) ? faker.string.alphanumeric(32) : null,
//         verificationTokenExpiry: faker.datatype.boolean(0.2) ? faker.date.future() : null,
//         resetToken: faker.datatype.boolean(0.05) ? faker.string.alphanumeric(32) : null,
//         resetTokenExpiry: faker.datatype.boolean(0.05) ? faker.date.future() : null,
//       },
//     });
//     entrepreneurs.push(entrepreneur);
//   }
//   console.log(`Created ${entrepreneurs.length} entrepreneur users`);

//   // Create Products (500)
//   const productStatuses = Object.values(ProductStatus);
//   const categories = Object.values(Category);
//   const products = [];
  
//   // Bulk create products using createMany for better performance
//   const productData = Array(500).fill(null).map((_, index) => {
//     const randomEntrepreneur = entrepreneurs[Math.floor(Math.random() * entrepreneurs.length)];
//     const status = productStatuses[Math.floor(Math.random() * productStatuses.length)];
//     const category = categories[Math.floor(Math.random() * categories.length)];
    
//     return {
//       title: faker.commerce.productName(),
//       description: faker.lorem.paragraphs(3),
//       videoUrl: `https://example.com/videos/${faker.string.uuid()}.mp4`,
//       status: status,
//       fundingAmount: status === ProductStatus.FUNDED || status === ProductStatus.APPROVED ? 
//         parseFloat(faker.finance.amount(50000, 2000000, 2)) : null,
//       pitchDeck: faker.datatype.boolean(0.8) ? `https://example.com/pitchdecks/${faker.string.uuid()}.pdf` : null,
//       images: Array(Math.floor(Math.random() * 5) + 1).fill(null).map(() => 
//         `https://example.com/images/${faker.string.uuid()}.jpg`
//       ),
//       category: category,
//       userId: randomEntrepreneur.id,
//     };
//   });
  
//   await prisma.product.createMany({
//     data: productData,
//     skipDuplicates: true,
//   });
  
//   // Fetch created products for mentorship creation
//   const createdProducts = await prisma.product.findMany({
//     where: {
//       status: {
//         in: [ProductStatus.APPROVED, ProductStatus.FUNDED]
//       }
//     }
//   });
  
//   console.log(`Created ${productData.length} products`);

//   // Create Mentorships (150)
//   const mentorshipStatuses = Object.values(MentorshipStatus);
//   const mentorshipData = [];
  
//   // Only create mentorships for approved or funded products
//   const eligibleProducts = createdProducts.filter(p => 
//     p.status === ProductStatus.APPROVED || p.status === ProductStatus.FUNDED
//   );
  
//   // Limit to 150 mentorships or fewer if there aren't enough eligible products
//   const mentorshipCount = Math.min(150, eligibleProducts.length);
  
//   for (let i = 0; i < mentorshipCount; i++) {
//     const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
//     const product = eligibleProducts[i]; // Each eligible product gets one mentorship
//     const status = mentorshipStatuses[Math.floor(Math.random() * mentorshipStatuses.length)];
    
//     mentorshipData.push({
//       mentorId: randomMentor.id,
//       productId: product.id,
//       status: status,
//       notes: faker.datatype.boolean(0.7) ? faker.lorem.paragraphs(2) : null,
//     });
//   }
  
//   // Use createMany for better performance
//   await prisma.mentorship.createMany({
//     data: mentorshipData,
//     skipDuplicates: true,
//   });
  
//   console.log(`Created ${mentorshipData.length} mentorships`);
//   console.log('Database seeding completed successfully!');
// }

// main()
//   .catch((e) => {
//     console.error('Error during seeding:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
