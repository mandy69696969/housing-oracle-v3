export const fetchRestCountries = async (name: string) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,currencies,population,area,flags`);
    if (!response.ok) throw new Error('RestCountries Fetch Failed');
    
    const data = await response.json();
    return data[0] || null;
  } catch (err) {
    console.warn('RestCountries Error:', err);
    return null;
  }
};
