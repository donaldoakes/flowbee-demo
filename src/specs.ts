export class Specs {

    static specs: any[] | undefined;

    static getSpecFileList(specBase: string) {

    }

    // static loadSpecs(specPath: string): any[] {
    //     const specs: string[] = [];
    //     for (const file of fs.readdirSync(specPath)) {
    //         const filepath = path.join(specPath, file);
    //         if (!fs.statSync(filepath).isDirectory() && file.endsWith('.spec')) {
    //             const text = fs.readFileSync(filepath, 'utf-8');
    //             if (text) {
    //                 try {
    //                     specs.push(JSON.parse(text));
    //                 } catch (err) {
    //                     console.log(err);
    //                     // this.log.error(err);
    //                 }
    //             }
    //         }
    //     }
    //     return specs;
    // }

}