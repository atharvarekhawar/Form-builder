"use client";
import { formatDistance } from "date-fns";
import ExcelJS from "exceljs";
import { BsDownload } from "react-icons/bs";
import { ElementsType } from "./FormElements";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

type columns = {
  id: string;
  label: string;
  required: boolean;
  type: ElementsType;
}[];

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

interface propsComponent {
  columns: columns;
  rows: Row[];
}

const ExcelButton: React.FC<propsComponent> = (props) => {
  // Function to handle Excel download
  const handleExcelDownload = async () => {
    const { columns, rows } = props;

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Form Submissions");

    // Add column headers to the worksheet
    const columnHeaders: string[] = [];
    columns.forEach((column: any) => {
      columnHeaders.push(column.label);
    });

    columnHeaders.push("Submitted At");
    worksheet.addRow(columnHeaders);

    // Set column labels to bold
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    // Add rows to the worksheet
    rows.map((row: any) => {
      const rowData = [];
      columns.map((column: any) => {
        rowData.push(row[column.id]);
      });
      rowData.push(
        formatDistance(row.submittedAt, new Date(), {
          addSuffix: true,
        })
      );
      worksheet.addRow(rowData);
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "form_submissions.xlsx";
    link.click();
    URL.revokeObjectURL(url);

    // Show success toast message
    toast({
      title: "Success!",
      description: "🚀 Excel sheet downloaded successfully 🚀",
    });
  };

  return (
    // Excel download button
    <Button variant={"outline"} className="gap-2" onClick={handleExcelDownload}>
      Excel
      <BsDownload className="h-4 w-4" />
    </Button>
  );
};

export default ExcelButton;
