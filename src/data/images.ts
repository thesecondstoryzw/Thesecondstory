export interface CoffeeImage {
  url: string;
  alt: string;
}

const px = (id: string, w = 940, h = 650) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}`;

export const heroImages: CoffeeImage[] = [
  { url: px('30691575', 1920, 1080), alt: 'Cinematic coffee shop interior with warm ambiance' },
  { url: px('31359640', 1920, 1080), alt: 'Dimly lit cafe with people in conversation' },
];

export const entranceImage: CoffeeImage = {
  url: px('2174069', 1920, 1080),
  alt: 'Warm, intimate coffee shop interior with vintage lighting',
};

export const brandStoryImages: CoffeeImage[] = [
  { url: px('11439363', 1200, 800), alt: 'Barista preparing coffee in a stylish setting' },
  { url: px('11439366', 1200, 800), alt: 'Modern coffee shop interior with wooden furniture' },
  { url: px('35911719', 1200, 800), alt: 'Warm urban cafe interior with people relaxing' },
];

export const coffeeExperienceImages: CoffeeImage[] = [
  { url: px('2036776', 1000, 700), alt: 'Milk pouring into coffee' },
  { url: px('2159095', 1000, 700), alt: 'Barista pouring brewed coffee into a glass' },
  { url: px('31986824', 1000, 700), alt: 'Pour-over coffee preparation close-up' },
  { url: px('35819418', 1000, 700), alt: 'Barista pouring coffee into mugs' },
  { url: px('5619514', 1000, 700), alt: 'Barista pouring coffee using a Chemex' },
  { url: px('31871767', 1000, 700), alt: 'Espresso pouring from machine' },
];

export const steamImage: CoffeeImage = {
  url: px('2067640', 1000, 700),
  alt: 'Steaming cup of espresso',
};

export const cupImage: CoffeeImage = {
  url: px('14356266', 800, 600),
  alt: 'Hot coffee in a black cup',
};

export const productImages: CoffeeImage[] = [
  { url: px('28495604', 600, 800), alt: 'Coffee bag on roasted beans' },
  { url: px('26117179', 600, 800), alt: 'Premium coffee with beans' },
  { url: px('16873215', 600, 800), alt: 'Coffee bag with scattered beans' },
];

export const roasteryImages: CoffeeImage[] = [
  { url: px('9623570', 1200, 800), alt: 'Freshly roasted coffee beans inside roasting machine' },
  { url: px('30669009', 1200, 800), alt: 'Coffee beans being roasted in industrial machine' },
  { url: px('16139709', 1200, 800), alt: 'Coffee beans roasted in large industrial roaster' },
  { url: px('4820819', 1200, 800), alt: 'Worker in coffee roastery' },
  { url: px('36828481', 1200, 800), alt: 'Coffee beans in Probat roaster' },
  { url: px('4820811', 1200, 800), alt: 'Coffee roaster control panel' },
];

export const galleryImages: CoffeeImage[] = [
  { url: px('36729518', 800, 500), alt: 'Friends drinking coffee and taking selfie in café' },
  { url: px('36729801', 800, 500), alt: 'Friends enjoying conversation over coffee' },
  { url: px('36729508', 800, 500), alt: 'Four friends sharing coffee in trendy cafe' },
  { url: px('6829469', 800, 500), alt: 'People in cozy Portuguese café' },
  { url: px('8344699', 800, 500), alt: 'Friends enjoying coffee break' },
  { url: px('3952080', 800, 500), alt: 'Friends at wooden tables in cozy cafeteria' },
  { url: px('4920848', 800, 500), alt: 'Friends gathered around table sharing coffee' },
  { url: px('12432817', 800, 500), alt: 'Cheerful group in vibrant cafe' },
  { url: px('4921522', 800, 500), alt: 'Friends enjoying coffee and conversation' },
];

export const beanImages: CoffeeImage[] = [
  { url: px('8619323', 600, 400), alt: 'Coffee beans spilling from cup onto dark surface' },
  { url: px('12165304', 600, 400), alt: 'Coffee beans spilling from burlap bag' },
  { url: px('19162213', 600, 400), alt: 'Roasted coffee beans on black surface' },
];

export const cafeWindowImage: CoffeeImage = {
  url: px('4551158', 1200, 800),
  alt: 'Glowing light bulbs in dark café interior through window',
};
