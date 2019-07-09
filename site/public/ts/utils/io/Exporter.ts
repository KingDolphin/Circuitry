import {Utils} from "./Utils";

declare var jsPDF: any; // jsPDF is external library

import {XMLWriter} from "./xml/XMLWriter";
import {Circuit} from "../../models/Circuit";

export const Exporter = (() => {

    return {
        saveFile: function(circuit: Circuit) {
            let filePath = Utils.escapeFileName(circuit.metadata.getName());
            const data = XMLWriter.fromLable(circuit).serialize();

            const filename = filePath + ".circuit";

            const file = new Blob([data], {type: "text/plain"});
            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else { // Others
                const a = document.createElement("a");
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        savePNG: function(canvas: HTMLCanvasElement, projectName: string): void {
            const data = canvas.toDataURL("image/png", 1.0);

            // Get name
            const filename = Utils.escapeFileName(projectName) + ".png";

            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                const file = new Blob([data], {type: "image/png"});
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else { // Others
                const a = document.createElement("a");
                const url = data;
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        savePDF: function(canvas: HTMLCanvasElement, projectName: string): void {
            const width  = canvas.width;
            const height = canvas.height;

            const data = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("l", "px", [width, height]);

            // Get name
            let filename = Utils.escapeFileName(projectName) + ".pdf";

            // Fill background
            pdf.setFillColor("#CCC");
            pdf.rect(0, 0, width, height, "F");

            const pdfWidth  = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);
        }
    }

})();
