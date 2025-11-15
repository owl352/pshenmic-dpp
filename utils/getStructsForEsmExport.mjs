import {Project, SyntaxKind} from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

const allowedExportTypes = [
  SyntaxKind.ClassDeclaration,
  SyntaxKind.EnumDeclaration,
  SyntaxKind.VariableDeclaration,
  SyntaxKind.FunctionDeclaration,
]

export function getStructsForEsmExport(typesPath) {
  const [types] = project.addSourceFilesAtPaths(typesPath);

  const exports = []

  for (const symbol of types.getExportSymbols()) {
    const [declaration] = symbol.getDeclarations()

    const declarationClassName = declaration.getKindName()

    if(allowedExportTypes.includes(SyntaxKind[declarationClassName])) {
      exports.push(symbol.getEscapedName())
    }
  }

  return exports
}
