import * as fs from "fs";

// Converts /chat streaming responses to a JSON array
function convertResponseToJson(inputPath: string): void {
  try {
    // Read the input file
    const content = fs.readFileSync(inputPath, "utf-8");

    // Split content into lines and filter out empty lines
    const lines = content.split("\n").filter((line) => line.trim());

    // Convert each line to the expected format
    const jsonLines = lines.map((line) => {
      // Add newlines to match the format in promptql-response.json
      return `${line}\n\n`;
    });

    // Create the output path with .json extension
    const outputPath = inputPath.replace(".txt", ".json");

    // Write the JSON array to the output file
    fs.writeFileSync(outputPath, JSON.stringify(jsonLines, null, 2));

    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

// Process command line arguments
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Please provide a file path to convert");
    process.exit(1);
  }

  const inputPath = args[0];

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  if (!inputPath.endsWith(".txt")) {
    console.error("Input file must be a .txt file");
    process.exit(1);
  }

  convertResponseToJson(inputPath);
}

main();
