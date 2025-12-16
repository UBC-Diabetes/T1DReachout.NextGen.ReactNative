/**
 * Gender Detection Test Script
 *
 * Usage:
 * 1. Replace the names in namesToTest array below with your list
 * 2. Run: node test-gender-detection.js
 *
 * Returns: 'male', 'female', 'unisex', or null (shown as 'unknown')
 */

const { detect } = require('gender-detection');

// ========================================
// REPLACE THIS ARRAY WITH YOUR NAMES
// ========================================
const namesToTest =
[
  "Shawna","Shelagh","sheree","Sherry","Sheryl","Sierra","Simon","Simran","Sina","Sooze","Stacy","Stella","Stephanie","steve","Steven","Stuart","Stuart","Support","Susan","Susan","Susan","Susan","Sydney","Sylvia","T","T1D","Talia","Tamara","Tammy","Tanya","Tara","Tech","Ted","Teresa","Teresa","Test","Thomas","Tim","Tim","Timothy","Tomas","Trevor","Tricia","Trie","Trina","Truus","Tyler","Vanessa","Vanessa","Vera","Veronica","Vidhi","Wella","Wendy","Wendy","Wendy","Will","Xue","Yasmin","Zulaika",
  "Lisa","Lisa","Lisanne","Logan","Lori-Dawn","Louise","Lucy","Lybbie","ma.","Madison","Maleeha","Marc","Marcie","Maria","Marina","Mark","Marni","Marni","Martin","mary","Matt","Matthias","Maureen","May","Megan","Meghan","Melanie","Melany","Michael","Michael","Michael","Michelle","Michelle","Michelle","Michelle","Mike","Mohamed","Monica","Morgan","Mya","Myra","Nabeel","Nabeel","Naomi","Natalie","Natalie","Natasha","Natasha","Nathan","Nick","Nicolas","Nicole","Nilou","Noa","Olivia","Paige","Pat","Patricia","Patrick","Patrick","Paul","Pearlsa","Peter","Philip","PJ","Poll","Rachel","Raman","Randy","Ravi","Regan","Reid","Renata","Richard","Rick","Rob","Rocket","Roy","Ryley","Sadie","Saffron","Sam","Sandra","Sandra","Sandra","Sandy","Sandy","Sandy","Sarah","Sarah","Sarah","Sarah","Serena","shalet","Shalet","Shara","Sharon","Sharyl","Shauna",
  "Diane","Doreen","Duane","Ed","Ehud","Eleanor","Elisabeth","Elizabeth","Emily","Emma","Eva","Evan","Evelyn","Fareeq","Frank","Fraser","Freya","Frieda","Garry","Geneva","George","Georgia","Gerri","Glen","Grant","Greg","Hannah","Heidi","Helen","Helene","Holly","Hugh","Hunter","Jacki","Jaclyn","Jacob","Jade","Janelle","Janet","Janet","Janette","Jason","Jeanette","Jeanette","Jeffrey","Jenna","Jennifer","Jennifer","Jennifer","Jeremy","Jesse","Jessica","Jessica","Jessica","Jessie-Anne","Jill","Joanne","Joey","Johanne","John","Jolene","Jonath","Jonath","Julie","Julie","Julie","June","Justin","Justine","Kaleim","Kara","Karen","Kassandra","Katie","Kayla","Kelly","Kent","Kevin","Kim","Kiran","Krista","Kyla","Lacey","LaReina","Laura","Laurel","Lauren","Lawrna","Leah","Lee","Leena","Len","Leslie","Lesly","Lia","Lianne","Lincoln","Linda","Linda","Lindsay",
  "Abd","Abigail","Agam","Akshay","Alaana","Alanna","Alea","Alex","alex","Alexa","Alexa","Aline","Alison","Alison","Allan","Allie","Alysha","Aman","Aman","Amanda","Amber","Amy","Ana","Andrea","Angela","Angela","Anita","Ann","Ann-Marie","Annie","Ashleigh","Ashley","Ashley","Barak","Baray","Barbara","Bea","Bernie","Bernie","Bev","Brian","Brittany","Brooklynn","Bryan","Bryanna","Caitlin","Caitlin","Caleb","Callum","Camilla","Carly","Carly","Carmen","Carol","caroline","Cassidy","Catherine","Cathy","Cayla","Charlene","Charlotte","Charlotte","Chelsea","Chelsey","Cherie","Chloe","Chris","Chris","Chris","Chris","Christina","Christopher","Cole","Connie","Connie","Corinne","Cory","Curtis","Dana","Dane","Daniel","Danielle","Dany"
]

console.log('\n=== Gender Detection Test ===\n');
console.log('Testing', namesToTest.length, 'names:\n');

const results = {
  male: [],
  female: [],
  unknown: []
};

namesToTest.forEach(name => {
  const detected = detect(name);
  const result = detected || 'unknown';

  // Ensure the result key exists in the results object
  if (!results[result]) {
    results[result] = [];
  }

  results[result].push(name);

  const emoji = result === 'male' ? '♂️' : result === 'female' ? '♀️' : '❓';
  console.log(`${emoji} ${name.padEnd(20)} → ${result}`);
});

console.log('\n=== Summary ===\n');
Object.keys(results).forEach(category => {
  const count = results[category].length;
  const percentage = ((count / namesToTest.length) * 100).toFixed(1);
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  console.log(`${label.padEnd(10)} ${count} (${percentage}%)`);
});
console.log('');
