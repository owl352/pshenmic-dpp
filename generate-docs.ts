import {Project, SyntaxKind, JSDocTagInfo, TypeFormatFlags} from "ts-morph";
import * as path from "path";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});

const dtsFiles = project.addSourceFilesAtPaths("dist/**/*.d.ts");
const jsFiles = project.addSourceFilesAtPaths("dist/**/*.js");

function getJsDocTextFromSignature(node: any) {
    // Параметры
    const params = node.getParameters().map((param: any) => {
        const paramName = param.getName();
        const paramType = param.getType().getText(undefined, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
        return ` * @param {${paramType}} ${paramName}`;
    });

    const returnType = node.getReturnType().getText(undefined, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
    const returnTag = returnType && returnType !== "void" ? [`@returns {${returnType}}`] : [];

    return [
        ...params,
        ...returnTag,
    ].join("\n");
}

for (const dtsFile of dtsFiles) {
    const classes = dtsFile.getClasses();
    for (const dtsClass of classes) {
        const className = dtsClass.getName();

        const jsFilePath = dtsFile.getFilePath().replace(".d.ts", ".js");
        const jsFile = jsFiles.find((f) => f.getFilePath() === jsFilePath);
        if (!jsFile) continue;

        const jsClass = jsFile.getClass(className);
        const tsClass = dtsFile.getClass(className)
        if (!jsClass) continue;

        for (const dtsMethod of dtsClass.getMethods()) {
            const methodName = dtsMethod.getName();


            const jsMethod = jsClass.getMethod(methodName);
            const tsMethod = tsClass.getMethod(methodName);
            if (!jsMethod) continue;

            if (jsMethod.getJsDocs().length === 0) {
                if (methodName=='free') {
                    jsMethod.addJsDoc("@ignore")
                    tsMethod.addJsDoc("@ignore")
                }


                const jsDocText = getJsDocTextFromSignature(dtsMethod);
                jsMethod.addJsDoc(jsDocText);
            }

            if(tsMethod){
                if (tsMethod.getJsDocs().length === 0) {
                    const jsDocText = getJsDocTextFromSignature(dtsMethod);
                    tsMethod.addJsDoc(jsDocText);
                }
            }
        }

        const dtsCtor = dtsClass.getConstructors()[0];
        const jsCtor = jsClass.getConstructors()[0];
        const tsCtor = tsClass.getConstructors()[0];
        if (dtsCtor && jsCtor && jsCtor.getJsDocs().length === 0) {
            const jsDocText = getJsDocTextFromSignature(dtsCtor);
            jsCtor.addJsDoc(jsDocText);
        }

        if (dtsCtor && tsCtor && tsCtor.getJsDocs().length === 0) {
            const jsDocText = getJsDocTextFromSignature(dtsCtor);
            tsCtor.addJsDoc(jsDocText);
        }
    }
}

project.saveSync();
