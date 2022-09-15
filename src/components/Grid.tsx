import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useCallback, useContext, useState } from "react";
import { KanbanContext, useKanban } from "../context/KanbanContext";
import DragSourceRenderer from "./DragSourceRenderer";
import {
  CellClassParams,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import "ag-grid-enterprise";
import CustomHeader from "./CustomHeader";

const Grid = () => {
  const { rows, dispatch } = useKanban();
  const columnDefs = [
    { field: "user", rowGroup: false, hide: true },
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
  ];

  const defaultColDef = {
    width: 300,
    sortable: true,
    filter: true,
    resizable: true,
    headerComponent: CustomHeader,
    cellRendererSelector: (params: any): any => {
      if (params.node.group) {
        return undefined;
      }
      return { component: DragSourceRenderer };
    },
  };
  const getRowId = useCallback(
    (params: GetRowIdParams) => params.data.rowId,
    []
  );

  return (
    <>
      <ul>
        {rows.map((row, idx) => (
          <li key={idx}>{JSON.stringify(row)}</li>
        ))}
      </ul>
      <AgGridReact
        className="ag-theme-alpine"
        rowData={rows.map((row) => ({
          ...row,
          cards: row.cards.map((card) => ({ ...card })),
        }))}
        defaultColDef={defaultColDef}
        rowDragManaged={true}
        groupRowRendererParams={{
          suppressCount: true,
          innerRenderer: (params: ICellRendererParams) => {
            const count = params.node.allChildrenCount;
            return `${params.value} (${
              count && count > 1 ? `${count} issues` : `${count} issue`
            })`;
          },
        }}
        // getRowId={getRowId}
        groupDefaultExpanded={-1}
        columnDefs={columnDefs}
        animateRows={true}
        groupDisplayType={"groupRows"}
        getRowHeight={(params) => {
          return params.node.group ? undefined : params.data ? 120 : undefined;
        }}
      ></AgGridReact>
    </>
  );
};

export default Grid;
