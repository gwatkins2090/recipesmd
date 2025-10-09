/**
 * Enhance Recipe Descriptions
 * Replaces generic auto-generated descriptions with detailed, appealing ones
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');

/**
 * Enhanced descriptions for specific recipes
 * Format: { filename: description }
 */
const ENHANCED_DESCRIPTIONS = {
  // DESSERTS
  'chocolate_chess_pie.md': 'A rich, fudgy chocolate chess pie with a silky custard filling and buttery crust. This Southern classic combines cocoa, eggs, and evaporated milk for an irresistibly decadent dessert that has been a family favorite for generations.',
  
  'black_bottom_pie.md': 'An elegant layered dessert featuring a chocolate custard base topped with fluffy rum-flavored cream and chocolate shavings. This show-stopping pie combines rich chocolate with light, airy cream for a perfectly balanced indulgence.',
  
  'pecan_pie.md': 'A classic Southern pecan pie with a gooey, caramel-like filling studded with crunchy pecans. The combination of butter, brown sugar, and corn syrup creates that signature sweet, nutty flavor that makes this pie irresistible.',
  
  'karo_pecan_pie.md': 'Maw Maw\'s signature pecan pie made with Karo syrup for that perfect glossy, sweet filling. The pecans toast beautifully in the oven, creating a crunchy top layer over the rich, gooey center.',
  
  'sweet_potato_pie.md': 'A smooth, spiced sweet potato pie that\'s a Southern holiday tradition. The natural sweetness of the potatoes blends with warm spices like cinnamon and nutmeg for a comforting, not-too-sweet dessert.',
  
  'coconut_pie_bayleys.md': 'A creamy coconut custard pie with a golden, slightly crispy top. The coconut flavor shines through in every bite, creating a tropical twist on classic Southern custard pie.',
  
  'paradise_pineapple_pie.md': 'A tropical-inspired pineapple pie with sweet, tangy fruit in a buttery crust. The pineapple filling is perfectly balanced between tart and sweet, making this a refreshing alternative to traditional fruit pies.',
  
  'fresh_blueberry_pie.md': 'A classic double-crust blueberry pie bursting with fresh, juicy berries. The filling thickens beautifully while baking, creating that perfect balance of sweet fruit and flaky pastry.',
  
  'lolas_southern_buttermilk_pie.md': 'A silky smooth buttermilk pie with a tangy-sweet custard filling. This old-fashioned Southern dessert has a texture similar to chess pie but with the distinctive tang of buttermilk.',
  
  'crazy_custard_pie.md': 'A magical self-layering pie that forms its own crust while baking. The custard filling is smooth and creamy with a delicate vanilla flavor - simple ingredients creating something extraordinary.',
  
  'boston_cream_pie.md': 'A classic Boston cream pie featuring layers of tender vanilla cake, rich custard filling, and glossy chocolate ganache. Despite its name, this beloved dessert is actually a cake that\'s been delighting families for generations.',
  
  'red_velvet_cake.md': 'A stunning red velvet cake with its signature cocoa-kissed flavor and vibrant color, topped with tangy cream cheese frosting. The tender, moist crumb and rich frosting make this a show-stopping dessert for any celebration.',
  
  'italian_cream_cake.md': 'A decadent Italian cream cake loaded with coconut and pecans, finished with luscious cream cheese frosting. Each layer is moist and flavorful, with the nuts adding a delightful crunch to every bite.',
  
  'blueberry_pound_cake.md': 'A dense, buttery pound cake studded with fresh blueberries throughout. The berries burst during baking, creating pockets of sweet, jammy fruit in the rich, tender crumb.',
  
  'coconut_almond_pound_cake.md': 'A rich pound cake infused with coconut and almond flavors for a sophisticated twist on the classic. The combination of extracts creates a bakery-quality cake with a fine, tender texture.',
  
  'ice_box_fruit_cake.md': 'A no-bake fruit cake that sets up in the refrigerator, perfect for hot summer days. Packed with candied fruits and nuts, this easy dessert has all the flavor of traditional fruitcake without turning on the oven.',
  
  'old_fashioned_short_cake.md': 'Classic shortcake biscuits that are tender, buttery, and perfect for layering with fresh berries and whipped cream. These are the real deal - not sponge cake, but proper Southern-style shortcake.',
  
  // BREADS & BISCUITS
  'angel_biscuits.md': 'Light-as-air angel biscuits made with yeast, baking powder, and buttermilk for the ultimate fluffy texture. These Southern-style biscuits rise beautifully and have a tender, pillowy crumb that practically melts in your mouth.',
  
  'best_rolls.md': 'Soft, pillowy dinner rolls with a golden-brown top and tender interior. These versatile rolls are perfect for any meal, from weeknight dinners to holiday feasts, and they freeze beautifully for make-ahead convenience.',
  
  'sour_cream_biscuits_recipe.md': 'Rich, tender biscuits made with sour cream for extra moisture and flavor. The sour cream creates an incredibly soft texture and adds a subtle tang that pairs perfectly with butter and jam.',
  
  'coon_cheese_sausage_biscuits.md': 'Savory biscuits loaded with cheese and sausage for a hearty breakfast or snack. These protein-packed biscuits are perfect for busy mornings or as a satisfying grab-and-go option.',
  
  'hot_bread.md': 'A quick and easy hot bread that comes together in minutes. Perfect for serving alongside soups, stews, or as a base for breakfast sandwiches.',
  
  'french_bread.md': 'Crusty French bread with a chewy interior and golden exterior. This homemade version rivals any bakery loaf and fills your kitchen with an irresistible aroma while baking.',
  
  'banana_nut_bread.md': 'Moist, flavorful banana bread studded with crunchy walnuts. This classic quick bread is the perfect way to use overripe bananas and makes a delicious breakfast or snack.',
  
  'zucchini_bread.md': 'A moist, lightly spiced zucchini bread that\'s a delicious way to use garden-fresh zucchini. The vegetable adds moisture without any vegetal flavor, creating a tender, cake-like bread.',
  
  'cranberry_nut_bread_recipe.md': 'A festive quick bread featuring tart cranberries and crunchy nuts. The cranberries provide bursts of tangy flavor that balance the sweet bread perfectly.',
  
  'nut_cake_2_loaves.md': 'A rich, nutty cake baked in loaf pans for easy slicing and serving. Packed with nuts throughout, this cake has a wonderful texture and makes a great gift.',
  
  'beef_bread.md': 'A savory bread loaded with seasoned ground beef and cheese. This hearty bread is substantial enough to serve as a meal on its own or alongside a simple salad.',
  
  // MUFFINS & SCONES
  'apricot_almond_scones.md': 'Buttery scones studded with sweet apricots and crunchy almonds. These bakery-style scones have crispy edges and a tender, flaky interior - perfect with morning coffee or afternoon tea.',
  
  'cranberry_orange_scones_full_recipe.md': 'Bright, citrusy scones featuring tart cranberries and fresh orange zest. The combination of flavors is refreshing and festive, making these perfect for holiday brunches.',
  
  'tylers_blueberry_scones_with_lemon_glaze.md': 'Tender blueberry scones drizzled with a sweet-tart lemon glaze. The fresh blueberries and bright lemon create a perfect balance of flavors.',
  
  'maui_pineapple_scones.md': 'Tropical-inspired scones with sweet pineapple pieces throughout. These bring a taste of the islands to your breakfast table with their buttery texture and fruity flavor.',
  
  'my_favorite_biscotti.md': 'Crunchy, twice-baked Italian cookies perfect for dunking in coffee or tea. These biscotti have just the right amount of sweetness and a satisfying crunch.',
  
  'jim_buck_ross_blueberry_buttermilk_muffins.md': 'Tender buttermilk muffins bursting with fresh blueberries. The buttermilk creates a fine, moist crumb while the berries add pops of sweet, juicy flavor.',
  
  'applesauce_muffins.md': 'Moist, lightly spiced muffins made with applesauce for natural sweetness and tender texture. These wholesome muffins are perfect for breakfast or lunchboxes.',
  
  'morning_glory_muffins.md': 'Hearty muffins packed with carrots, apples, coconut, and nuts. These nutritious muffins are like carrot cake in muffin form - moist, flavorful, and satisfying.',
  
  'raisin_bran_muffins.md': 'Wholesome bran muffins studded with plump raisins. These fiber-rich muffins are perfect for a healthy breakfast and the batter can be made ahead and stored in the refrigerator.',
  
  // MAIN DISHES
  'chicken_spaghetti.md': 'A hearty, cheesy chicken spaghetti casserole loaded with Velveeta, Rotel tomatoes, and tender chicken. This crowd-pleasing Tex-Mex inspired comfort food is perfect for potlucks and freezes beautifully for easy weeknight dinners.',
  
  'chicken_casserole_serves_12.md': 'A generous chicken casserole that feeds a crowd with creamy sauce and tender chicken. Perfect for church suppers, family reunions, or any time you need to feed a large group.',
  
  'chicken_dressing_casserole_jan_g.md': 'A comforting casserole combining chicken and cornbread dressing in one dish. This Southern favorite brings together two classics for a satisfying, homestyle meal.',
  
  'chicken_rice_casserole.md': 'A simple, creamy chicken and rice casserole that\'s pure comfort food. The rice cooks right in the casserole, absorbing all the flavorful chicken juices.',
  
  'crunchy_chicken_recipe.md': 'Crispy, golden chicken with a crunchy coating that stays crisp. The secret is in the coating technique that creates an extra-crunchy exterior while keeping the chicken juicy inside.',
  
  'pickapeppa_marinated_chicken.md': 'Flavorful chicken marinated in tangy Pickapeppa sauce. The Jamaican-style sauce adds a unique sweet-spicy flavor that makes this chicken anything but ordinary.',
  
  'baked_chicken_breasts_en_casserole.md': 'Tender chicken breasts baked in a flavorful sauce until perfectly moist. This elegant yet easy dish is perfect for both weeknight dinners and special occasions.',
  
  'lasagne.md': 'Classic Italian lasagna with layers of pasta, rich meat sauce, and creamy cheese. This hearty casserole is worth the effort and feeds a crowd with plenty of leftovers.',
  
  'meat_loaf.md': 'Traditional meatloaf with a savory glaze that\'s pure comfort food. Moist and flavorful, this family favorite is even better the next day in sandwiches.',
  
  'ham_loaf_supreme.md': 'A sophisticated take on meatloaf using ground ham for a unique, flavorful main dish. The sweet glaze perfectly complements the savory ham.',
  
  'meat_loaf_pizza.md': 'A fun twist on meatloaf with pizza flavors baked right in. Kids and adults alike love this creative combination of two family favorites.',
  
  'stuffed_peppers.md': 'Colorful bell peppers stuffed with seasoned meat and rice, then baked until tender. These make a complete meal in a beautiful, edible package.',
  
  'hamburg_noodle_bake.md': 'A budget-friendly casserole combining ground beef and noodles in a creamy sauce. This simple, satisfying dish has been feeding families for generations.',
  
  'chipped_beef_casserole.md': 'A creamy casserole featuring dried beef in a rich sauce over toast or noodles. This old-fashioned comfort food is making a comeback.',
  
  'tuna_casserole.md': 'Classic tuna noodle casserole with a crispy topping. This pantry-staple dinner comes together quickly and is always a hit with kids.',
  
  'catfish_allison.md': 'Southern-style catfish with a flavorful preparation that highlights the mild, sweet fish. This recipe turns catfish into an elegant dinner.',
  
  'chessy_catfish.md': 'Catfish topped with a cheesy coating that bakes to golden perfection. The cheese adds richness while keeping the fish moist and tender.',
  
  'catfish_with_pecan_brown_butter_recipe.md': 'Elegant catfish topped with nutty brown butter and toasted pecans. This restaurant-quality dish is surprisingly easy to make at home.',
  
  'crunch_catfish_with_lemon_butter_sauce.md': 'Crispy catfish fillets served with a bright, tangy lemon butter sauce. The crunchy coating and zesty sauce make this catfish irresistible.',
  
  'panko_crusted_salmon_recipe.md': 'Salmon fillets coated in crispy panko breadcrumbs and baked until golden. The Japanese-style breadcrumbs create an extra-crunchy crust.',
  
  'salmon_croquettes.md': 'Crispy salmon patties with a tender interior - a Southern classic. These budget-friendly croquettes are perfect for breakfast, lunch, or dinner.',
  
  'salmon_loaf.md': 'A retro salmon loaf that\'s making a comeback. Similar to meatloaf but with flaky salmon, this is comfort food with a twist.',
  
  'quiche.md': 'A versatile quiche recipe that works for breakfast, brunch, or dinner. The custard filling is creamy and rich, perfect with any combination of fillings.',
  
  'ham_steak.md': 'Glazed ham steak that\'s quick to prepare and full of flavor. Perfect for a fast weeknight dinner or special breakfast.',
  
  'ham_croquettes.md': 'Crispy fried croquettes made with leftover ham. These golden nuggets are a delicious way to use up holiday ham.',
  
  'meat_balls_spaghetti.md': 'Tender, flavorful meatballs in rich tomato sauce served over spaghetti. This Italian-American classic is always a crowd-pleaser.',
  
  'meat_stuffing_for_jumbo_shells_or_manicotti.md': 'A savory meat and cheese filling perfect for stuffed pasta. This versatile filling works with shells, manicotti, or even lasagna.',
  
  'shrimp_casserole_express_printing.md': 'An elegant shrimp casserole that\'s perfect for special occasions. The shrimp stay tender while the sauce becomes rich and flavorful.',
  
  // BREAKFAST & BRUNCH
  'breakfast_casserole.md': 'A make-ahead breakfast casserole loaded with eggs, cheese, and savory ingredients. Perfect for holiday mornings or weekend brunches when you want to feed a crowd without last-minute cooking.',
  
  'christmas_breakfast_sausage_casserole.md': 'A festive breakfast casserole featuring savory sausage, eggs, and cheese. This Christmas morning tradition can be assembled the night before for stress-free holiday hosting.',
  
  'dorothy_browns_breakfast_casserole.md': 'Dorothy Brown\'s famous breakfast casserole that\'s been a family favorite for years. The combination of ingredients creates a satisfying, protein-packed start to the day.',
  
  'sausage_egg_casserole.md': 'A hearty sausage and egg casserole that\'s perfect for feeding a crowd. The eggs puff up beautifully while baking, creating a light yet satisfying texture.',
  
  'breakfastbrunch_roll_up.md': 'Portable breakfast roll-ups that are perfect for busy mornings. These can be made ahead and reheated for a quick, satisfying breakfast on the go.',
  
  'sausage_biscuit_snackmeal.md': 'Savory sausage biscuits that work as breakfast, snack, or a light meal. These portable bites are perfect for lunchboxes or road trips.',
  
  // SOUPS & SALADS  
  'broccoli_cheese_soup.md': 'A creamy, comforting broccoli cheese soup that\'s restaurant-quality. The cheese melts into the soup creating a velvety texture, while the broccoli adds color and nutrition.',
  
  'corn_chowder_soup.md': 'A hearty corn chowder with sweet corn kernels in a creamy base. This satisfying soup is perfect for cool evenings and pairs beautifully with crusty bread.',
  
  'delicious_ham_and_potato_soup.md': 'A thick, creamy soup featuring chunks of ham and tender potatoes. This is comfort in a bowl - perfect for using up leftover holiday ham.',
  
  'potato_green_onion_soup.md': 'A flavorful potato soup with the fresh bite of green onions. The onions add a subtle sharpness that elevates this beyond ordinary potato soup.',
  
  'carrot_soup_louella_donelson.md': 'Louella Donelson\'s smooth, slightly sweet carrot soup. The carrots are pureed until silky, creating an elegant first course or light lunch.',
  
  'barley_soup.md': 'A hearty, wholesome soup featuring chewy barley and vegetables. This nutritious soup is filling enough to be a meal on its own.',
  
  'best_ever_salad.md': 'A crowd-pleasing salad that lives up to its name. The combination of fresh ingredients and flavorful dressing makes this a standout side dish.',
  
  'maes_chicken_salad.md': 'Mae\'s famous chicken salad with the perfect balance of creamy and crunchy. This versatile salad is perfect for sandwiches, crackers, or served over lettuce.',
  
  'grape_salad.md': 'A sweet and creamy grape salad that\'s always a hit at potlucks. The combination of grapes, cream cheese, and pecans is surprisingly addictive.',
  
  'pistachio_salad.md': 'A retro pistachio salad with its signature green color and fluffy texture. This sweet salad is part dessert, part side dish, and all delicious.',
  
  'raw_cranberry_salad.md': 'A bright, tart cranberry salad with fresh cranberries and oranges. The raw cranberries provide a refreshing contrast to rich holiday meals.',
  
  // SIDE DISHES & CASSEROLES
  'baked_grits.md': 'Creamy, cheesy baked grits that are a Southern breakfast and brunch staple. The cheese melts into the grits creating a rich, indulgent texture with a slightly crispy top.',
  
  'broccoli_rice_casserole.md': 'A classic broccoli and rice casserole with a creamy cheese sauce. This versatile side dish pairs well with any protein and is always a hit at potlucks.',
  
  'corn_rice_casserole.md': 'A sweet and savory casserole combining corn and rice. The corn adds natural sweetness while the rice provides a satisfying, hearty base.',
  
  'green_bean_corn_casserole.md': 'A colorful vegetable casserole featuring green beans and corn. This is an easy way to get vegetables on the table in a form everyone will enjoy.',
  
  'hash_brown_potato_casserole.md': 'The ultimate comfort food side dish with crispy hash browns in a creamy sauce. This crowd-pleasing casserole is a must-have at holiday dinners and potlucks.',
  
  'frozen_north_dressing_potato_casserole.md': 'A unique casserole combining dressing and potatoes in one dish. This creative side dish saves oven space during holiday meal prep.',
  
  'squash_dressing.md': 'A Southern specialty combining squash with cornbread dressing. The squash adds moisture and a subtle sweetness to the savory dressing.',
  
  'old_fashioned_cornbread_dressing_southern_living.md': 'Traditional Southern cornbread dressing that\'s a must-have at holiday meals. This recipe creates the perfect balance of crispy edges and moist, flavorful interior.',
  
  'wild_rice.md': 'Nutty, flavorful wild rice that makes an elegant side dish. The distinctive texture and earthy flavor of wild rice elevates any meal.',
  
  'hot_fruit.md': 'A warm, comforting fruit compote featuring peaches, pears, pineapple, and plums baked with brown sugar and butter. This versatile dish works as a brunch side, dessert, or holiday accompaniment to ham.',
  
  // APPETIZERS & DIPS
  'shrimp_dip.md': 'A creamy, flavorful shrimp dip that\'s always the first to disappear at parties. Serve with crackers or vegetables for an elegant appetizer.',
  
  'various_appetizersdips.md': 'A collection of tried-and-true appetizers and dips perfect for entertaining. These crowd-pleasers are easy to make and always a hit.',
  
  'putn_on_the_ritz.md': 'An easy, elegant appetizer using Ritz crackers as the base. These bite-sized treats are perfect for parties and can be customized with various toppings.',
  
  'salted_pecans_express_printing.md': 'Perfectly seasoned salted pecans that are addictively crunchy. These make great gifts or party snacks and are impossible to stop eating.',
  
  // SAUCES & CONDIMENTS
  'comeback_sauce_recipe.md': 'Mississippi\'s famous comeback sauce - a tangy, slightly spicy condiment that goes with everything. Once you try it, you\'ll understand why it\'s called "comeback" sauce.',
  
  'pear_honey_recipe.md': 'A sweet pear spread that\'s like honey but made from fresh pears. This old-fashioned preserve is delicious on biscuits, toast, or as a glaze for meats.',
  
  'stuffing_for_flounder.md': 'A flavorful seafood stuffing perfect for flounder or other delicate fish. The stuffing adds moisture and flavor while complementing the mild fish.',
  
  // SPECIAL RECIPES
  'becky_chicken_dumplings.md': 'Becky\'s comforting chicken and dumplings with tender, fluffy dumplings in rich chicken broth. This soul-warming dish is the ultimate comfort food on a cold day.',
};

/**
 * Update recipe description in YAML frontmatter
 */
function updateRecipeDescription(filePath, newDescription) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find and replace the description line
  const updatedContent = content.replace(
    /^description:\s*.+$/m,
    `description: "${newDescription}"`
  );
  
  // Also update the description in the markdown content section
  const finalContent = updatedContent.replace(
    /(## Description\n\n).+/,
    `$1${newDescription}`
  );
  
  fs.writeFileSync(filePath, finalContent, 'utf-8');
}

/**
 * Process all recipes with enhanced descriptions
 */
function enhanceAllDescriptions() {
  console.log('✍️  Enhancing Recipe Descriptions\n');
  console.log('='.repeat(60));
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  Object.entries(ENHANCED_DESCRIPTIONS).forEach(([filename, description]) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  ${filename} - File not found`);
      skippedCount++;
      return;
    }
    
    updateRecipeDescription(filePath, description);
    console.log(`✅ ${filename}`);
    updatedCount++;
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Results:\n');
  console.log(`Total recipes with enhanced descriptions: ${Object.keys(ENHANCED_DESCRIPTIONS).length}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Descriptions enhanced successfully!\n');
}

// Run the script
if (require.main === module) {
  enhanceAllDescriptions();
}

module.exports = { enhanceAllDescriptions, ENHANCED_DESCRIPTIONS };

