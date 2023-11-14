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

            const state = vscode.SymbolKind.Enum
            const event = vscode.SymbolKind.Enum
            const struct = vscode.SymbolKind.Struct
            const port = vscode.SymbolKind.Interface
            const func = vscode.SymbolKind.Function
            const action = vscode.SymbolKind.Field
            const transition = vscode.SymbolKind.Package

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
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
                    const name = line.text.match(/transition\s*\((.*)\)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "T..  "+name[1]+" ",
                        '',
                        transition,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("in_port")) {
                    const name = line.text.match(/in_port\s*\(\s*(.*)\)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "in_port( "+name[1]+")",
                        '',
                        port,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
                else if (line.text.trim().startsWith("out_port")) {
                    const name = line.text.match(/out_port\s*\(\s*(.*)\)/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "out_port( "+name[1]+")",
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
                }else if(line.text.match(/[a-zA-Z_]\w+\s+[a-zA-Z_]\w+\((.*)\)/)){
                    const name = line.text.match(/[a-zA-Z_]\w+\s+([a-zA-Z_]\w+\(.*\))/)
                    if (name==null){
                        continue
                    }
                    const marker_symbol = new vscode.DocumentSymbol(
                        "f..  "+name[1],
                        '',
                        func,
                        line.range, line.range)
                    nodes[nodes.length-1].push(marker_symbol)
                }
            }
            resolve(symbols);
        });
    }
}