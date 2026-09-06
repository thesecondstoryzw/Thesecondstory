export interface CoffeeImage {
  url: string;
  alt: string;
}

const px = (id: string, w = 940, h = 650) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}`;

export const heroImages: CoffeeImage[] = [
  { url: px('18150815', 1920, 1080), alt: 'Warm nighttime interior of modern cafe with patrons' },
  { url: px('38506755', 1920, 1080), alt: 'Lively cafe scene with customers and baristas' },
];

export const heroImage: CoffeeImage = heroImages[0];

export const beanJourneyImages: CoffeeImage[] = [
  { url: px('8619323', 1200, 800), alt: 'Coffee beans spilling from cup onto dark surface' },
  { url: px('19162213', 1200, 800), alt: 'Roasted coffee beans scattered on black surface' },
];

export const roasteryImages: CoffeeImage[] = [
  { url: px('9623570', 1200, 800), alt: 'Freshly roasted coffee beans inside roasting machine' },
  { url: px('16139709', 1200, 800), alt: 'Coffee beans roasted in large industrial roaster' },
  { url: px('30669009', 1200, 800), alt: 'Coffee beans being roasted in industrial machine' },
  { url: px('36828481', 1200, 800), alt: 'Coffee beans in Probat roaster' },
];

export const brewingImages: CoffeeImage[] = [
  { url: px('2036776', 1200, 800), alt: 'Milk pouring into coffee cup' },
  { url: px('2159095', 1200, 800), alt: 'Barista pouring brewed coffee into a glass' },
  { url: px('31986824', 1200, 800), alt: 'Pour-over coffee preparation close-up' },
  { url: px('5619514', 1200, 800), alt: 'Barista pouring coffee using a Chemex' },
];

export const cupImages: CoffeeImage[] = [
  { url: px('15276834', 800, 1200), alt: 'Latte art top view moody shadows' },
  { url: px('15404792', 800, 1200), alt: 'Coffee cup with latte art on dark surface' },
  { url: px('36772681', 800, 1200), alt: 'Cappuccino with foam art top view' },
];

export const communityImages: CoffeeImage[] = [
  { url: px('36765288', 1000, 600), alt: 'Two women enjoying coffee and conversation at cafe' },
  { url: px('36729519', 1000, 600), alt: 'Barista serves coffee to friends at cozy café' },
  { url: px('4920855', 1000, 600), alt: 'Friends enjoying coffee around a café table' },
  { url: px('15838685', 1000, 600), alt: 'Coffee cups on table with people in café' },
  { url: px('36765285', 1000, 600), alt: 'Two women enjoying warm coffee chat' },
  { url: px('4920856', 1000, 600), alt: 'Friends enjoying coffee served by waiter' },
  { url: px('5047021', 1000, 600), alt: 'Two women enjoying coffee and conversation outdoors' },
  { url: px('18009497', 1000, 600), alt: 'Two men at café enjoying coffee' },
];

export const lifestyleImages: CoffeeImage[] = [
  { url: px('13088689', 1000, 600), alt: 'Woman enjoying a book with coffee by window' },
  { url: px('36730476', 1000, 600), alt: 'Woman enjoying book and coffee in cozy setting' },
  { url: px('36697339', 1000, 600), alt: 'Man with coffee and book in cozy chair by window' },
  { url: px('36697338', 1000, 600), alt: 'Man enjoying coffee and book by bright window' },
  { url: px('3563697', 1000, 600), alt: 'Man reading by window in warm atmosphere' },
  { url: px('28887479', 1000, 600), alt: 'Hands reading book by window with coffee' },
];

export const cafeInteriorImages: CoffeeImage[] = [
  { url: px('34831568', 1200, 800), alt: 'Cozy café with modern decor and warm lighting' },
  { url: px('38055463', 1200, 800), alt: 'Cozy coffee shop filled with people' },
  { url: px('3952080', 1200, 800), alt: 'Friends at wooden tables in cozy cafeteria' },
  { url: px('3910126', 1200, 800), alt: 'Warm café interior with wooden furniture' },
  { url: px('19367174', 1200, 800), alt: 'Modern coffee shop with customers at tables' },
  { url: px('2067552', 1200, 800), alt: 'Stylish modern cafe with plants and warm lighting' },
];

export const steamImage: CoffeeImage = {
  url: px('2067640', 1000, 700),
  alt: 'Steaming cup of espresso',
};

export const cafeWindowImage: CoffeeImage = {
  url: px('18150815', 1200, 800),
  alt: 'Warm nighttime interior of modern cafe',
};
