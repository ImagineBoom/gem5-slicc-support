'use strict';

// src/extension.ts

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {scheme: "file", language: "gem5-slicc"},
            new gem5slicc_DocumentSymbolProvider()
        )
    );

    context.subscriptions.push(
        vscode.languages.registerReferenceProvider(
            'gem5-slicc',
            new gem5sliccReferenceProvider()
        )
    );
}

class gem5slicc_DocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    private format(cmd: string):string{
        return cmd
    }

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]>
        {
        return new Promise((resolve, reject) =>
        {
            const symbols: vscode.DocumentSymbol[] = [];
            const nodes = [symbols]
            var in_struct = false
            const state = vscode.SymbolKind.Enum
            const event = vscode.SymbolKind.Enum
            const struct = vscode.SymbolKind.Struct
            const port = vscode.SymbolKind.Interface
            const func = vscode.SymbolKind.Function
            const action = vscode.SymbolKind.Field
            const transition = vscode.SymbolKind.Package

            for (let i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                var nextline = null
                if(i+1<document.lineCount){
                    nextline=document.lineAt(i+1)
                }

                // const tokens = line.text.split(" ")
                if (line.text.trim().startsWith("action")) {
                    const name = line.text.match(/action\s*\(\s*(\w+)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "a..  "+name[1],
                        '',
                        action,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("transition")) {
                    const name = line.text.match(/transition\s*\(([^)]*)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "T..  "+name[1],
                        '',
                        transition,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("in_port")) {
                    const name = line.text.match(/in_port\s*\((.*)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "in_port( "+name[1],
                        '',
                        port,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("out_port")) {
                    const name = line.text.match(/out_port\s*\((.*)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "out_port( "+name[1],
                        '',
                        port,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("structure")) {
                    const name = line.text.match(/structure\s*\(\s*(\w+)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "struct: "+name[1],
                        '',
                        struct,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                    in_struct=true
                }
                else if (line.text.trim().startsWith("enumeration")) {
                    const name = line.text.match(/enumeration\s*\(\s*(\w+)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "enum: "+name[1],
                        '',
                        event,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("state_declaration")) {
                    const name = line.text.match(/state_declaration\s*\(\s*(\w+)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        name[1],
                        '',
                        state,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }else if(!in_struct){
                    var is_func=false
                    var name
                    if(line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\(.*\))\s*[^\)\{]*\s*\{/)){
                        is_func=true
                        name=line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\(.*\))/)
                    } else if(line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\(.*\))\s*$/)){
                        if(nextline?.text.match(/^\s*\{/)){
                            is_func=true
                            name=line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\(.*\))/)
                        }
                    }else if(line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\([^\(\)\{\}]*$)/)){
                        // ), score=1
                        // ) and then { , score=2, maybe one line or multi lines
                        var score=0
                        for (var j=i+1;j < document.lineCount; j++) {
                            if(j>=document.lineCount){
                                is_func=false
                                break
                            }
                            var tmp_line = document.lineAt(j);
                            if(tmp_line.text.match(/[^\)\{]*[\(\}]+/)){
                                is_func=false
                                break
                            } else if(score==0) {
                                if(tmp_line.text.match(/[^\)\{]*\)\s*[^\)\{]*\s*\{/)){
                                    is_func=true
                                    break
                                }
                                if(tmp_line.text.match(/[^\)\{]*\)\s*[^\)\{]*\s*/)){
                                    score=1
                                }
                            } else if(score==1){
                                if(tmp_line.text.match(/[^\)\{]*\{\s*/)){
                                    score=2
                                    is_func=true
                                    i=j
                                }
                            }
                        }
                        if(is_func){
                            name=line.text.match(/^[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\s*\([^\(\)\{\}]*)\s*/)
                        }

                    }

                    if (name==null || is_func==false){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "f..  "+name[1],
                        '',
                        func,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }else if(line.text.match(/^\s*\}/)){
                    if(in_struct){
                        in_struct=false
                    }
                }
            }
            resolve(symbols);
        });
    }
}

// class gem5sliccReferenceProvider implements vscode.ReferenceProvider {
//     public async provideReferences(
//         document: vscode.TextDocument, position: vscode.Position,
//         options: { includeDeclaration: boolean }, token: vscode.CancellationToken):
//         Promise<vscode.Location[]> {
//         //Get all files in the current workspace
//         const allFiles = vscode.workspace.findFiles('**/*.sm');

//         return allFiles.then(async (files) => {
//             const references: vscode.Location[] = [];

//             // Process files in parallel
//             for (const fileUri of files) {
//                 try {
//                     // Get the TextDocument object for the file
//                     const fileDocument = await vscode.workspace.openTextDocument(fileUri);

//                     // Read the content of the file
//                     const fileContent = fileDocument.getText();

//                     // Find references to the same word at the given position in the text
//                     const wordRange = document.getWordRangeAtPosition(position);
//                     if (wordRange) {
//                         const referenceText = document.getText(wordRange);
//                         const referenceRegExp = new RegExp(`\\b${referenceText}\\b`, 'g');
//                         let match;

//                         while ((match = referenceRegExp.exec(fileContent))) {
//                             // Calculate the position of the match in the file
//                             const matchOffset = match.index;
//                             const matchStartPosition = fileDocument.positionAt(matchOffset);
//                             const matchEndPosition = fileDocument.positionAt(matchOffset + referenceText.length);
//                             const referenceRange = new vscode.Range(matchStartPosition, matchEndPosition);
//                             const referenceLocation = new vscode.Location(fileUri, referenceRange);
//                             references.push(referenceLocation);
//                         }
//                     }
//                 } catch (error) {
//                     console.error(`Error reading file ${fileUri.fsPath}: ${error}`);
//                 }
//             }

//             return references;
//         });
//     }
// }

class gem5sliccReferenceProvider implements vscode.ReferenceProvider {
    public async provideReferences(
        document: vscode.TextDocument, position: vscode.Position,
        options: { includeDeclaration: boolean }, token: vscode.CancellationToken):
        Promise<vscode.Location[]> {

        // Get all files in the current workspace
        const allFiles = vscode.workspace.findFiles('**/*.sm');

        return allFiles.then(async (files) => {
            const references: vscode.Location[] = [];

            // Process files in parallel
            await Promise.all(files.map(async (fileUri) => {
                try {
                    // Get the TextDocument object for the file
                    const fileDocument = await vscode.workspace.openTextDocument(fileUri);

                    // Read the content of the file
                    const fileContent = fileDocument.getText();

                    // Find references to the same word at the given position in the text
                    const wordRange = document.getWordRangeAtPosition(position);
                    if (wordRange) {
                        const referenceText = document.getText(wordRange);
                        const referenceRegExp = new RegExp(`\\b${referenceText}\\b`, 'g');
                        let match;

                        while ((match = referenceRegExp.exec(fileContent))) {
                            // Calculate the position of the match in the file
                            const matchOffset = match.index;
                            const matchStartPosition = fileDocument.positionAt(matchOffset);
                            const matchEndPosition = fileDocument.positionAt(matchOffset + referenceText.length);
                            const referenceRange = new vscode.Range(matchStartPosition, matchEndPosition);
                            const referenceLocation = new vscode.Location(fileUri, referenceRange);
                            references.push(referenceLocation);
                        }
                    }
                } catch (error) {
                    console.error(`Error reading file ${fileUri.fsPath}: ${error}`);
                }
            }));

            return references;
        });
    }
}
