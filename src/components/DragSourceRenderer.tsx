import { ICellRendererParams } from "@ag-grid-community/core";
import React, { useCallback } from "react";
import Card from "./Card";

const DragSourceRenderer = (params: ICellRendererParams) => {
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    var types = event.dataTransfer.types;
    var dragSupported = types.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = "move";
    }
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    var textData = JSON.parse(event.dataTransfer.getData("text/plain"));
    // create new row
    if (params.data.user !== textData.data.user) {
      console.log(params.data);
      params.api.applyTransaction({
        update: [
          {
            ...textData.data,
            user: params.data.user,
            state: params.column?.getColId(),
          },
        ],
      });
    }
    // update the row
    if (params.rowIndex === textData.rowIndex) {
      const colId = params.column?.getColId();
      const node = params.node;

      node.setData({ ...textData.data, state: colId });
    }
  }, []);

  const onDragStart = useCallback(
    (dragEvent: React.DragEvent<HTMLDivElement>) => {
      console.log("onDragStart");
      var userAgent = window.navigator.userAgent;
      dragEvent.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ data: params.data, rowIndex: params.rowIndex })
      );
    },
    []
  );

  const columnId = params.column?.getColId();
  const isDraggable = columnId === params.data.state;
  return (
    <div
      className="drag-card"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {params.data.state === columnId && (
        <Card draggable={isDraggable} data={params.data} />
      )}
    </div>
  );
};

export default DragSourceRenderer;
