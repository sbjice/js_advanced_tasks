export function calculateDiscount(price, percent) {
  if (typeof price !== 'number' || typeof percent !== 'number') {
    throw TypeError('Аргументы должны быть числами');
  }
  return (price / 100) * percent;
}

export function getMarketingPrice(product) {
  const productObject = JSON.parse(product);
  try {
    return productObject.prices.marketingPrice;
  } catch(error) {
    return null;
  }
}

// Функция имитирует неудачный запрос за картинкой
function fetchAvatarImage(userId) {
  return new Promise((resolve, reject) => {
    if(userId) {
      resolve();
    } else reject(new Error(`Error while fetching image for user with id ${userId}`));
  });
}

export async function getAvatarUrl(userId) {
  const image = await fetchAvatarImage(userId);
  try{
    return image.url;
  } catch(error) {
    return '/images/default.jpg';
  }
}
