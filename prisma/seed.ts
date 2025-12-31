import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // EVENTS
  // ============================================
  console.log('📅 Creating events...');

  const events = [
    {
      name: 'Tomorrowland',
      slug: 'tomorrowland-2025',
      description: "The world's largest electronic music festival",
      eventType: 'MUSIC_FESTIVAL' as const,
      tags: ['electronic', 'edm', 'camping'],
      startDate: new Date('2025-07-18'),
      endDate: new Date('2025-07-27'),
      venueName: 'De Schorre',
      city: 'Boom',
      country: 'Belgium',
      expectedAttendance: 400000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    },
    {
      name: 'Glastonbury Festival',
      slug: 'glastonbury-2025',
      description: 'Legendary music and performing arts festival',
      eventType: 'MUSIC_FESTIVAL' as const,
      tags: ['rock', 'pop', 'indie', 'camping'],
      startDate: new Date('2025-06-25'),
      endDate: new Date('2025-06-29'),
      venueName: 'Worthy Farm',
      city: 'Pilton',
      country: 'United Kingdom',
      expectedAttendance: 200000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    },
    {
      name: 'Coachella',
      slug: 'coachella-2025',
      description: 'Annual music and arts festival in California',
      eventType: 'MUSIC_FESTIVAL' as const,
      tags: ['pop', 'rock', 'hip-hop', 'electronic'],
      startDate: new Date('2025-04-11'),
      endDate: new Date('2025-04-20'),
      venueName: 'Empire Polo Club',
      city: 'Indio',
      country: 'United States',
      expectedAttendance: 250000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    },
    {
      name: 'Lowlands',
      slug: 'lowlands-2025',
      description: 'Dutch music festival with diverse lineup',
      eventType: 'MUSIC_FESTIVAL' as const,
      tags: ['rock', 'electronic', 'hip-hop', 'camping'],
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-17'),
      venueName: 'Evenemententerrein Walibi Holland',
      city: 'Biddinghuizen',
      country: 'Netherlands',
      expectedAttendance: 60000,
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    },
    {
      name: 'Web Summit',
      slug: 'web-summit-2025',
      description: "The world's largest tech conference",
      eventType: 'CONFERENCE' as const,
      tags: ['tech', 'startup', 'innovation'],
      startDate: new Date('2025-11-11'),
      endDate: new Date('2025-11-14'),
      venueName: 'Altice Arena',
      city: 'Lisbon',
      country: 'Portugal',
      expectedAttendance: 70000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    },
    {
      name: 'Formula 1 Monaco Grand Prix',
      slug: 'f1-monaco-2025',
      description: 'The most prestigious race on the F1 calendar',
      eventType: 'SPORTS_EVENT' as const,
      tags: ['f1', 'racing', 'motorsport'],
      startDate: new Date('2025-05-23'),
      endDate: new Date('2025-05-25'),
      city: 'Monte Carlo',
      country: 'Monaco',
      expectedAttendance: 100000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
    },
    {
      name: 'Gamescom',
      slug: 'gamescom-2025',
      description: "Europe's largest gaming convention",
      eventType: 'CONVENTION' as const,
      tags: ['gaming', 'esports', 'tech'],
      startDate: new Date('2025-08-20'),
      endDate: new Date('2025-08-24'),
      venueName: 'Koelnmesse',
      city: 'Cologne',
      country: 'Germany',
      expectedAttendance: 370000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    },
    {
      name: 'Burning Man',
      slug: 'burning-man-2025',
      description: 'Annual gathering in the Black Rock Desert',
      eventType: 'CULTURAL_EVENT' as const,
      tags: ['art', 'community', 'camping', 'desert'],
      startDate: new Date('2025-08-24'),
      endDate: new Date('2025-09-01'),
      venueName: 'Black Rock City',
      city: 'Black Rock Desert',
      country: 'United States',
      expectedAttendance: 80000,
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }
  console.log(`✅ Created ${events.length} events\n`);

  // ============================================
  // USERS WITH PROFILES
  // ============================================
  console.log('👥 Creating users with profiles...');

  const users = [
    // Admin user
    {
      email: 'admin@sharingiscaring.app',
      name: 'Admin User',
      role: 'ADMIN' as const,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      profile: {
        displayName: 'Admin',
        bio: 'Platform administrator',
        gender: 'PREFER_NOT_TO_SAY' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'FLEXIBLE' as const,
        cleanlinessLevel: 4,
        socialLevel: 3,
        smokingTolerance: 3,
        drinkingTolerance: 3,
        interests: ['technology', 'music'],
        languages: ['English', 'Dutch'],
        verificationLevel: 'ID' as const,
        profileCompleteness: 100,
        city: 'Amsterdam',
        country: 'Netherlands',
      },
    },
    // Test users with varied profiles
    {
      email: 'emma.wilson@test.com',
      name: 'Emma Wilson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      profile: {
        displayName: 'Emma',
        bio: 'Festival lover & photographer. Always looking for good vibes and new friends! 📸✨',
        age: 28,
        gender: 'FEMALE' as const,
        genderPreference: 'FEMALE_ONLY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 4,
        socialLevel: 5,
        smokingTolerance: 2,
        drinkingTolerance: 4,
        budgetMin: 50,
        budgetMax: 150,
        interests: ['photography', 'electronic music', 'dancing', 'yoga'],
        languages: ['English', 'Spanish'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 95,
        city: 'London',
        country: 'United Kingdom',
      },
    },
    {
      email: 'james.chen@test.com',
      name: 'James Chen',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      profile: {
        displayName: 'James',
        bio: 'Tech entrepreneur by day, music festival enthusiast by weekend. Love meeting new people!',
        age: 32,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'MODERATE' as const,
        cleanlinessLevel: 5,
        socialLevel: 4,
        smokingTolerance: 1,
        drinkingTolerance: 3,
        budgetMin: 100,
        budgetMax: 300,
        interests: ['technology', 'startups', 'electronic music', 'traveling'],
        languages: ['English', 'Mandarin', 'Japanese'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 90,
        city: 'San Francisco',
        country: 'United States',
      },
    },
    {
      email: 'sofia.martinez@test.com',
      name: 'Sofia Martinez',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
      profile: {
        displayName: 'Sofia',
        bio: 'Architect & design lover. Looking for creative souls to share festival experiences 🎨',
        age: 26,
        gender: 'FEMALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'EARLY_BIRD' as const,
        cleanlinessLevel: 5,
        socialLevel: 3,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 80,
        budgetMax: 200,
        interests: ['architecture', 'art', 'design', 'indie music'],
        languages: ['English', 'Spanish', 'Portuguese'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 85,
        city: 'Barcelona',
        country: 'Spain',
      },
    },
    {
      email: 'max.mueller@test.com',
      name: 'Max Müller',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=max',
      profile: {
        displayName: 'Max',
        bio: 'Gaming enthusiast & Gamescom regular. Also into electronic music and good food 🎮',
        age: 24,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 3,
        socialLevel: 4,
        smokingTolerance: 3,
        drinkingTolerance: 4,
        budgetMin: 40,
        budgetMax: 100,
        interests: ['gaming', 'esports', 'electronic music', 'anime'],
        languages: ['English', 'German'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 80,
        city: 'Berlin',
        country: 'Germany',
      },
    },
    {
      email: 'lisa.andersson@test.com',
      name: 'Lisa Andersson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
      profile: {
        displayName: 'Lisa',
        bio: 'Minimalist traveler. Love house music and meaningful conversations ☀️',
        age: 29,
        gender: 'FEMALE' as const,
        genderPreference: 'FEMALE_ONLY' as const,
        sleepSchedule: 'MODERATE' as const,
        cleanlinessLevel: 5,
        socialLevel: 3,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 60,
        budgetMax: 120,
        interests: ['house music', 'meditation', 'travel', 'sustainability'],
        languages: ['English', 'Swedish', 'Norwegian'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 92,
        city: 'Stockholm',
        country: 'Sweden',
      },
    },
    {
      email: 'tom.brown@test.com',
      name: 'Tom Brown',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
      profile: {
        displayName: 'Tom',
        bio: 'Drummer in a rock band. Been to Glastonbury 5 times! Looking for festival buddies 🥁',
        age: 31,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 3,
        socialLevel: 5,
        smokingTolerance: 4,
        drinkingTolerance: 5,
        budgetMin: 50,
        budgetMax: 150,
        interests: ['rock music', 'drums', 'festivals', 'camping'],
        languages: ['English'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 88,
        city: 'Manchester',
        country: 'United Kingdom',
      },
    },
    {
      email: 'yuki.tanaka@test.com',
      name: 'Yuki Tanaka',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki',
      profile: {
        displayName: 'Yuki',
        bio: 'Game developer attending Gamescom. Quiet but friendly! 日本語OK 🎮',
        age: 27,
        gender: 'NON_BINARY' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'FLEXIBLE' as const,
        cleanlinessLevel: 4,
        socialLevel: 2,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 70,
        budgetMax: 180,
        interests: ['gaming', 'programming', 'anime', 'japanese culture'],
        languages: ['English', 'Japanese'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 78,
        city: 'Tokyo',
        country: 'Japan',
      },
    },
    {
      email: 'olivia.jones@test.com',
      name: 'Olivia Jones',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
      profile: {
        displayName: 'Olivia',
        bio: 'Marketing manager & F1 fanatic! Monte Carlo here I come 🏎️',
        age: 30,
        gender: 'FEMALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'EARLY_BIRD' as const,
        cleanlinessLevel: 5,
        socialLevel: 4,
        smokingTolerance: 1,
        drinkingTolerance: 3,
        budgetMin: 150,
        budgetMax: 400,
        interests: ['formula 1', 'racing', 'luxury travel', 'wine'],
        languages: ['English', 'French'],
        verificationLevel: 'ID' as const,
        profileCompleteness: 95,
        city: 'Paris',
        country: 'France',
      },
    },
    {
      email: 'david.kim@test.com',
      name: 'David Kim',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      profile: {
        displayName: 'David',
        bio: 'K-pop fan & tech worker. First time at Coachella, looking for experienced festival-goers!',
        age: 25,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'MODERATE' as const,
        cleanlinessLevel: 4,
        socialLevel: 3,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 80,
        budgetMax: 200,
        interests: ['k-pop', 'technology', 'photography', 'fitness'],
        languages: ['English', 'Korean'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 82,
        city: 'Los Angeles',
        country: 'United States',
      },
    },
    {
      email: 'nina.petrov@test.com',
      name: 'Nina Petrov',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
      profile: {
        displayName: 'Nina',
        bio: 'DJ & producer. Tomorrowland is my second home! 🎧',
        age: 27,
        gender: 'FEMALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 3,
        socialLevel: 5,
        smokingTolerance: 3,
        drinkingTolerance: 4,
        budgetMin: 60,
        budgetMax: 180,
        interests: ['djing', 'production', 'electronic music', 'dancing'],
        languages: ['English', 'Russian', 'Dutch'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 90,
        city: 'Amsterdam',
        country: 'Netherlands',
      },
    },
    {
      email: 'alex.thompson@test.com',
      name: 'Alex Thompson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      profile: {
        displayName: 'Alex',
        bio: 'Startup founder. Web Summit every year! Love connecting with founders.',
        age: 34,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'EARLY_BIRD' as const,
        cleanlinessLevel: 5,
        socialLevel: 5,
        smokingTolerance: 1,
        drinkingTolerance: 3,
        budgetMin: 120,
        budgetMax: 350,
        interests: ['startups', 'investing', 'technology', 'networking'],
        languages: ['English', 'Portuguese'],
        verificationLevel: 'ID' as const,
        profileCompleteness: 98,
        city: 'Dublin',
        country: 'Ireland',
      },
    },
    {
      email: 'marie.dubois@test.com',
      name: 'Marie Dubois',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      profile: {
        displayName: 'Marie',
        bio: 'Yoga instructor looking for zen festival experiences. No party animals please 🧘‍♀️',
        age: 33,
        gender: 'FEMALE' as const,
        genderPreference: 'FEMALE_ONLY' as const,
        sleepSchedule: 'EARLY_BIRD' as const,
        cleanlinessLevel: 5,
        socialLevel: 2,
        smokingTolerance: 1,
        drinkingTolerance: 1,
        budgetMin: 70,
        budgetMax: 160,
        interests: ['yoga', 'meditation', 'wellness', 'nature'],
        languages: ['English', 'French'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 88,
        city: 'Lyon',
        country: 'France',
      },
    },
    {
      email: 'ryan.oconnor@test.com',
      name: 'Ryan O\'Connor',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan',
      profile: {
        displayName: 'Ryan',
        bio: 'Bartender & music lover. Can make a mean cocktail at the campsite! 🍹',
        age: 26,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 3,
        socialLevel: 5,
        smokingTolerance: 4,
        drinkingTolerance: 5,
        budgetMin: 40,
        budgetMax: 100,
        interests: ['mixology', 'rock music', 'camping', 'cooking'],
        languages: ['English', 'Irish'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 75,
        city: 'Dublin',
        country: 'Ireland',
      },
    },
    {
      email: 'hannah.schmidt@test.com',
      name: 'Hannah Schmidt',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hannah',
      profile: {
        displayName: 'Hannah',
        bio: 'Environmental scientist. Love outdoor festivals with sustainable vibes 🌿',
        age: 29,
        gender: 'FEMALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'MODERATE' as const,
        cleanlinessLevel: 4,
        socialLevel: 3,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 50,
        budgetMax: 130,
        interests: ['sustainability', 'nature', 'folk music', 'hiking'],
        languages: ['English', 'German', 'Dutch'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 85,
        city: 'Munich',
        country: 'Germany',
      },
    },
    {
      email: 'lucas.silva@test.com',
      name: 'Lucas Silva',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas',
      profile: {
        displayName: 'Lucas',
        bio: 'Burning Man veteran (5 years!). Happy to guide first-timers 🔥',
        age: 35,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'FLEXIBLE' as const,
        cleanlinessLevel: 3,
        socialLevel: 5,
        smokingTolerance: 5,
        drinkingTolerance: 4,
        budgetMin: 100,
        budgetMax: 300,
        interests: ['art', 'burning man', 'community', 'desert camping'],
        languages: ['English', 'Portuguese', 'Spanish'],
        verificationLevel: 'ID' as const,
        profileCompleteness: 92,
        city: 'São Paulo',
        country: 'Brazil',
      },
    },
    {
      email: 'elena.popov@test.com',
      name: 'Elena Popov',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
      profile: {
        displayName: 'Elena',
        bio: 'Classical musician exploring electronic festivals. Curious and open-minded! 🎻',
        age: 28,
        gender: 'FEMALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'MODERATE' as const,
        cleanlinessLevel: 4,
        socialLevel: 3,
        smokingTolerance: 2,
        drinkingTolerance: 3,
        budgetMin: 80,
        budgetMax: 200,
        interests: ['classical music', 'electronic music', 'art', 'culture'],
        languages: ['English', 'Russian', 'German'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 80,
        city: 'Vienna',
        country: 'Austria',
      },
    },
    {
      email: 'mike.johnson@test.com',
      name: 'Mike Johnson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      profile: {
        displayName: 'Mike',
        bio: 'Photographer & videographer. Will document our festival adventures! 📹',
        age: 30,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'FLEXIBLE' as const,
        cleanlinessLevel: 3,
        socialLevel: 4,
        smokingTolerance: 3,
        drinkingTolerance: 3,
        budgetMin: 60,
        budgetMax: 180,
        interests: ['photography', 'videography', 'festivals', 'travel'],
        languages: ['English'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 87,
        city: 'New York',
        country: 'United States',
      },
    },
    {
      email: 'sara.lindgren@test.com',
      name: 'Sara Lindgren',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
      profile: {
        displayName: 'Sara',
        bio: 'Nurse taking a well-deserved vacation. Looking for chill roommates 🌸',
        age: 31,
        gender: 'FEMALE' as const,
        genderPreference: 'FEMALE_ONLY' as const,
        sleepSchedule: 'EARLY_BIRD' as const,
        cleanlinessLevel: 5,
        socialLevel: 3,
        smokingTolerance: 1,
        drinkingTolerance: 2,
        budgetMin: 70,
        budgetMax: 160,
        interests: ['wellness', 'pop music', 'reading', 'nature'],
        languages: ['English', 'Swedish', 'Finnish'],
        verificationLevel: 'PHONE' as const,
        profileCompleteness: 90,
        city: 'Helsinki',
        country: 'Finland',
      },
    },
    {
      email: 'carlos.rodriguez@test.com',
      name: 'Carlos Rodriguez',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      profile: {
        displayName: 'Carlos',
        bio: 'Comic book artist heading to SDCC. Cosplay enthusiast! 🦸',
        age: 27,
        gender: 'MALE' as const,
        genderPreference: 'ANY' as const,
        sleepSchedule: 'NIGHT_OWL' as const,
        cleanlinessLevel: 3,
        socialLevel: 4,
        smokingTolerance: 2,
        drinkingTolerance: 3,
        budgetMin: 50,
        budgetMax: 140,
        interests: ['comics', 'cosplay', 'art', 'movies'],
        languages: ['English', 'Spanish'],
        verificationLevel: 'EMAIL' as const,
        profileCompleteness: 82,
        city: 'Mexico City',
        country: 'Mexico',
      },
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const { profile, ...userFields } = userData;
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        ...userFields,
        profile: { update: profile },
      },
      create: {
        ...userFields,
        profile: { create: profile },
      },
      include: { profile: true },
    });
    createdUsers.push(user);
  }
  console.log(`✅ Created ${createdUsers.length} users with profiles\n`);

  // ============================================
  // EVENT ATTENDANCES
  // ============================================
  console.log('🎫 Creating event attendances...');

  const tomorrowland = await prisma.event.findUnique({ where: { slug: 'tomorrowland-2025' } });
  const glastonbury = await prisma.event.findUnique({ where: { slug: 'glastonbury-2025' } });
  const gamescom = await prisma.event.findUnique({ where: { slug: 'gamescom-2025' } });
  const webSummit = await prisma.event.findUnique({ where: { slug: 'web-summit-2025' } });
  const coachella = await prisma.event.findUnique({ where: { slug: 'coachella-2025' } });
  const burningMan = await prisma.event.findUnique({ where: { slug: 'burning-man-2025' } });

  // Map users to events they'd likely attend
  const attendances = [
    // Tomorrowland attendees
    { email: 'emma.wilson@test.com', eventSlug: 'tomorrowland-2025', status: 'LOOKING' as const },
    { email: 'nina.petrov@test.com', eventSlug: 'tomorrowland-2025', status: 'HAVE_ROOM' as const },
    { email: 'james.chen@test.com', eventSlug: 'tomorrowland-2025', status: 'LOOKING' as const },
    { email: 'tom.brown@test.com', eventSlug: 'tomorrowland-2025', status: 'LOOKING' as const },
    { email: 'elena.popov@test.com', eventSlug: 'tomorrowland-2025', status: 'LOOKING' as const },
    // Glastonbury attendees
    { email: 'tom.brown@test.com', eventSlug: 'glastonbury-2025', status: 'HAVE_ROOM' as const },
    { email: 'emma.wilson@test.com', eventSlug: 'glastonbury-2025', status: 'LOOKING' as const },
    { email: 'ryan.oconnor@test.com', eventSlug: 'glastonbury-2025', status: 'LOOKING' as const },
    { email: 'hannah.schmidt@test.com', eventSlug: 'glastonbury-2025', status: 'LOOKING' as const },
    // Gamescom attendees
    { email: 'max.mueller@test.com', eventSlug: 'gamescom-2025', status: 'HAVE_ROOM' as const },
    { email: 'yuki.tanaka@test.com', eventSlug: 'gamescom-2025', status: 'LOOKING' as const },
    { email: 'david.kim@test.com', eventSlug: 'gamescom-2025', status: 'LOOKING' as const },
    // Web Summit attendees
    { email: 'alex.thompson@test.com', eventSlug: 'web-summit-2025', status: 'HAVE_ROOM' as const },
    { email: 'james.chen@test.com', eventSlug: 'web-summit-2025', status: 'LOOKING' as const },
    { email: 'sofia.martinez@test.com', eventSlug: 'web-summit-2025', status: 'LOOKING' as const },
    // Coachella attendees
    { email: 'david.kim@test.com', eventSlug: 'coachella-2025', status: 'LOOKING' as const },
    { email: 'emma.wilson@test.com', eventSlug: 'coachella-2025', status: 'LOOKING' as const },
    { email: 'mike.johnson@test.com', eventSlug: 'coachella-2025', status: 'HAVE_ROOM' as const },
    // Burning Man attendees
    { email: 'lucas.silva@test.com', eventSlug: 'burning-man-2025', status: 'HAVE_ROOM' as const },
    { email: 'nina.petrov@test.com', eventSlug: 'burning-man-2025', status: 'LOOKING' as const },
  ];

  for (const att of attendances) {
    const user = await prisma.user.findUnique({ where: { email: att.email } });
    const event = await prisma.event.findUnique({ where: { slug: att.eventSlug } });
    if (user && event) {
      await prisma.eventAttendance.upsert({
        where: { userId_eventId: { userId: user.id, eventId: event.id } },
        update: { accommodationStatus: att.status },
        create: {
          userId: user.id,
          eventId: event.id,
          accommodationStatus: att.status,
        },
      });
    }
  }
  console.log(`✅ Created ${attendances.length} event attendances\n`);

  // ============================================
  // ACCOMMODATIONS
  // ============================================
  console.log('🏕️ Creating accommodations...');

  const nina = await prisma.user.findUnique({ where: { email: 'nina.petrov@test.com' } });
  const tom = await prisma.user.findUnique({ where: { email: 'tom.brown@test.com' } });
  const max = await prisma.user.findUnique({ where: { email: 'max.mueller@test.com' } });
  const alex = await prisma.user.findUnique({ where: { email: 'alex.thompson@test.com' } });
  const mike = await prisma.user.findUnique({ where: { email: 'mike.johnson@test.com' } });
  const lucas = await prisma.user.findUnique({ where: { email: 'lucas.silva@test.com' } });

  if (tomorrowland && nina) {
    await prisma.accommodation.create({
      data: {
        ownerId: nina.id,
        eventId: tomorrowland.id,
        title: 'Cozy tent near Dreamville entrance',
        description: 'Large 4-person tent with good ventilation. Close to showers and food. Looking for 2 more people to share!',
        accommodationType: 'TENT',
        totalSpots: 4,
        availableSpots: 2,
        costTotal: 280,
        isCostSplit: true,
        amenities: ['tent', 'sleeping bags', 'camping chairs', 'cooler'],
        distanceToVenue: '10 min walk',
      },
    });
  }

  if (glastonbury && tom) {
    await prisma.accommodation.create({
      data: {
        ownerId: tom.id,
        eventId: glastonbury.id,
        title: 'Camper van with 3 beds',
        description: 'Classic VW camper with beds for 3. Has a small kitchen. Festival veteran - know all the best spots!',
        accommodationType: 'CAMPER_VAN',
        totalSpots: 3,
        availableSpots: 2,
        costTotal: 450,
        isCostSplit: true,
        amenities: ['beds', 'kitchen', 'fridge', 'solar charger'],
        distanceToVenue: '5 min walk',
      },
    });
  }

  if (gamescom && max) {
    await prisma.accommodation.create({
      data: {
        ownerId: max.id,
        eventId: gamescom.id,
        title: 'Airbnb apartment - 2 bedrooms',
        description: 'Nice apartment 15 min from Koelnmesse by train. Has fast wifi for streaming and 2 bedrooms.',
        accommodationType: 'AIRBNB',
        totalSpots: 4,
        availableSpots: 3,
        costPerNight: 45,
        costTotal: 225,
        isCostSplit: true,
        amenities: ['wifi', 'kitchen', 'washer', 'gaming setup'],
        distanceToVenue: '15 min by train',
      },
    });
  }

  if (webSummit && alex) {
    await prisma.accommodation.create({
      data: {
        ownerId: alex.id,
        eventId: webSummit.id,
        title: 'Hotel room near Altice Arena',
        description: 'Booked a nice hotel room with 2 queen beds. Great for networking - lobby bar is a hotspot!',
        accommodationType: 'HOTEL_ROOM',
        totalSpots: 2,
        availableSpots: 1,
        costPerNight: 120,
        costTotal: 480,
        isCostSplit: true,
        amenities: ['wifi', 'breakfast', 'gym', 'bar'],
        distanceToVenue: '3 min walk',
      },
    });
  }

  if (coachella && mike) {
    await prisma.accommodation.create({
      data: {
        ownerId: mike.id,
        eventId: coachella.id,
        title: 'Campsite setup for 6',
        description: 'Got a great camping spot with 2 large tents. Bringing generators and a full kitchen setup!',
        accommodationType: 'TENT',
        totalSpots: 6,
        availableSpots: 4,
        costTotal: 600,
        isCostSplit: true,
        amenities: ['tents', 'generator', 'kitchen', 'shade structure', 'chairs'],
        distanceToVenue: '15 min walk',
      },
    });
  }

  if (burningMan && lucas) {
    await prisma.accommodation.create({
      data: {
        ownerId: lucas.id,
        eventId: burningMan.id,
        title: 'Experienced camp with full setup',
        description: '5th year at the Burn! Our camp has shade structures, a bar, and bikes. Looking for 2 more burners who know the drill.',
        accommodationType: 'OTHER',
        totalSpots: 4,
        availableSpots: 2,
        costTotal: 800,
        isCostSplit: true,
        amenities: ['shade structure', 'bar', 'bikes', 'kitchen', 'shower'],
        distanceToVenue: 'On playa',
      },
    });
  }

  console.log('✅ Created 6 accommodations\n');

  console.log('🎉 Seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`   - ${events.length} events`);
  console.log(`   - ${users.length} users with profiles`);
  console.log(`   - ${attendances.length} event attendances`);
  console.log('   - 6 accommodations\n');
  console.log('🔑 Admin login: admin@sharingiscaring.app');
  console.log('👤 Test user example: emma.wilson@test.com\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
