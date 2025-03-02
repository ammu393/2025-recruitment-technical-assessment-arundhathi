import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: "ingredient" | "recipe";
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook = new Map<string, cookbookEntry>();

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const capitalize_word = (recipeName: string): string => {
  return recipeName
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
}

const remove_hyphen = (recipeName: string): string => {
  return recipeName
          .split('')
          .map(letter => letter === "_" || letter === "-" ? letter = " " : letter)
          .join('')
}

const remove_unnecessary_characters = (recipeName: string) : string => {
  return recipeName
          .trim()
          .replace(/[^a-zA-Z\s]/g, "")
          .replace(/\s+/g, " ")
}


const parse_handwriting = (recipeName: string): string | null => {
 
  let cleanedName = remove_unnecessary_characters(remove_hyphen(recipeName));

  return cleanedName.length > 0 ? capitalize_word(cleanedName) : null; // Ensure valid output
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req: Request, res: Response) => {
  const { name, type, requiredItems, cookTime } = req.body;

  if (type !== "recipe" && type !== "ingredient") {
    res.status(400).send("Invalid type");
    return;
  } 
  if (cookbook.has(name)) {
    res.status(400).send("Name must be unique");
    return;
  }
  if (type == "recipe") {
    const uniqueItemNames = new Set(requiredItems.map(item => item.name));
    if (uniqueItemNames.size !== requiredItems.length) {
      res.status(400).send("Each required item must be unique");
      return;
    }
    const newRecipe: recipe = {name, type, requiredItems}
    cookbook.set(name, newRecipe)

  }
  if (type == "ingredient") {
    if (cookTime < 0) {
      res.status(400).send("cookTime must be greater than or equal to 0.");
      return;
    }
    const newIngredient: ingredient = { name, type, cookTime}
    cookbook.set(name, newIngredient);
  } 
  
  res.status(200).send()
  return;

});

const getSummary = (recipeName: string) : { cookTime: number, ingredients: requiredItem[] } => {

  if (!cookbook.has(recipeName)) {
    throw new Error("recipe does not exist");
  }

  const recipe = cookbook.get(recipeName) as recipe;
  let totalCookTime = 0;
  const ingredientMap = new Map<string, number>();
  
  for (const item of recipe.requiredItems) {
    const subItem = cookbook.get(item.name);
    if (subItem.type == "recipe") {
      const subSummary = getSummary(subItem.name); // recurse again
      totalCookTime += subSummary.cookTime * item.quantity;
      for (const ingr of subSummary.ingredients) {
        ingredientMap.set(ingr.name, (ingredientMap.get(ingr.name) || 0) + ingr.quantity * item.quantity);
      }
    } else if (subItem.type == "ingredient") { // base case
        const ingredient = subItem as ingredient;
        totalCookTime += ingredient.cookTime * item.quantity;
        ingredientMap.set(ingredient.name, (ingredientMap.get(ingredient.name) || 0) + item.quantity);

    }
  }
  return {
    cookTime: totalCookTime,
    ingredients: Array.from(ingredientMap, ([name, quantity]) => ({ name, quantity }))
  };

}
// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res: Response) => {
  const { name } = req.query;

  if (typeof name !== "string") {
    res.status(400).send("Invalid query parameter.");
    return;
  }

  if (!cookbook.has(name)) {
    res.status(400).send("Recipe not found.");
    return;
  }

  const entry = cookbook.get(name);

  if (entry?.type !== "recipe") {
    res.status(400).send("Requested name is not a recipe.");
    return;
  }

  try {
    const summary = getSummary(name);
    res.json({ name, cookTime: summary.cookTime, ingredients: summary.ingredients });
  } catch (error) {
    res.status(400).send(error.message);
  }
  return;
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
