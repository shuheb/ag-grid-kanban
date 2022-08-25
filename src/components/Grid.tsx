import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { useMemo, useState } from "react";
import DragSourceRenderer from "./DragSourceRenderer";

export type KanbanData = {
  id?: number;
  state?: string;
  assigned?: boolean;
  tags?: string[];
  user: string;
  task?: string;
  unassigned?: boolean;
};

const Grid = () => {
  const [rowData] = useState<KanbanData[]>([
    {
      id: 1,
      state: "todo",
      task: "Tweak Blog Post",
      tags: ["Product", "Feature"],
      user: "Shuheb Ahmed",
    },
    {
      id: 2,
      state: "todo",
      task: "Grid Component",
      tags: ["Engineering", "Bug"],
      user: "Stephen Cooper",
    },
    {
      id: 3,
      unassigned: true,
      user: "Unassigned",
      state: "unassigned",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 300,
      sortable: true,
      filter: true,
      resizable: true,
      cellRendererSelector: (params: any): any => {
        if (params.node.group) {
          return undefined;
        }
        return { component: DragSourceRenderer };
      },
    };
  }, []);
  const [columnDefs] = useState<ColDef[]>([
    { field: "user", rowGroup: true, hide: true },
    {
      headerName: "TODO",
      field: "todo",
      cellClass: (params: CellClassParams) =>
        !params.node.group ? "padding-8" : "",
    },
    {
      headerName: "IN PROGRESS",
      field: "in_progress",
    },
    {
      headerName: "DONE",
      field: "done",
    },
  ]);

  return (
    <AgGridReact
      className="ag-theme-alpine"
      rowData={rowData}
      defaultColDef={defaultColDef}
      modules={[ClientSideRowModelModule, RowGroupingModule]}
      rowDragManaged={true}
      onGridReady={(params) => {}}
      groupRowRendererParams={{
        suppressCount: true,
        innerRenderer: (params: ICellRendererParams) => {
          const count = params.node.allChildrenCount;
          return `${params.value} (${
            count && count > 1 ? `${count} issues` : `${count} issue`
          })`;
        },
      }}
      getRowId={(params) => params.data.id}
      groupDefaultExpanded={-1}
      columnDefs={columnDefs}
      animateRows={true}
      groupDisplayType={"groupRows"}
      getRowHeight={(params) => {
        return params.node.group
          ? undefined
          : params.data.user
          ? 100
          : undefined;
      }}
    />
  );
};

export default Grid;
