import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample events
  const events = [
    // Music Festivals
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
    },
    {
      name: 'Coachella Valley Music and Arts Festival',
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
    },
    // Conferences
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
    },
    {
      name: 'SXSW',
      slug: 'sxsw-2025',
      description: 'South by Southwest - Film, Interactive, Music',
      eventType: 'CONFERENCE' as const,
      tags: ['tech', 'music', 'film', 'innovation'],
      startDate: new Date('2025-03-07'),
      endDate: new Date('2025-03-15'),
      city: 'Austin',
      country: 'United States',
      expectedAttendance: 100000,
    },
    // Sports Events
    {
      name: 'UEFA Champions League Final',
      slug: 'ucl-final-2025',
      description: 'The biggest club football match of the year',
      eventType: 'SPORTS_EVENT' as const,
      tags: ['football', 'soccer', 'champions-league'],
      startDate: new Date('2025-05-31'),
      endDate: new Date('2025-05-31'),
      venueName: 'Allianz Arena',
      city: 'Munich',
      country: 'Germany',
      expectedAttendance: 70000,
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
    },
    // Concerts
    {
      name: 'Taylor Swift - Eras Tour Europe',
      slug: 'taylor-swift-london-2025',
      description: 'Taylor Swift Eras Tour European leg',
      eventType: 'CONCERT' as const,
      tags: ['pop', 'taylor-swift'],
      startDate: new Date('2025-06-21'),
      endDate: new Date('2025-06-23'),
      venueName: 'Wembley Stadium',
      city: 'London',
      country: 'United Kingdom',
      expectedAttendance: 90000,
    },
    // Conventions
    {
      name: 'San Diego Comic-Con',
      slug: 'sdcc-2025',
      description: 'The ultimate pop culture convention',
      eventType: 'CONVENTION' as const,
      tags: ['comics', 'movies', 'gaming', 'cosplay'],
      startDate: new Date('2025-07-24'),
      endDate: new Date('2025-07-27'),
      venueName: 'San Diego Convention Center',
      city: 'San Diego',
      country: 'United States',
      expectedAttendance: 130000,
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
    },
    // Trade Shows
    {
      name: 'CES 2025',
      slug: 'ces-2025',
      description: 'Consumer Electronics Show',
      eventType: 'TRADE_SHOW' as const,
      tags: ['tech', 'electronics', 'innovation'],
      startDate: new Date('2025-01-07'),
      endDate: new Date('2025-01-10'),
      venueName: 'Las Vegas Convention Center',
      city: 'Las Vegas',
      country: 'United States',
      expectedAttendance: 180000,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
    console.log(`Created/updated event: ${event.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
