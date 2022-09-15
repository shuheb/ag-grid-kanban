import { ICellRendererParams } from "ag-grid-community";
import React, { memo, useContext } from "react";
import {
  ICard,
  KanbanContext,
  Stage,
  useKanban,
} from "../context/KanbanContext";
import Card from "./Card";

const DragSourceRenderer = memo((params: ICellRendererParams) => {
  const { dispatch } = useKanban();
  const columnId = params.column?.getColId() as Stage;

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    var types = event.dataTransfer.types;
    var dragSupported = types.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = "move";
    }
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { card, rowId, rowIndex } = JSON.parse(
      event.dataTransfer.getData("text/plain")
    );

    dispatch({
      type: "update",
      from: {
        rowId,
        rowIndex,
        cardId: card.cardId,
        stage: card.stage,
      },
      to: {
        stage: columnId,
        rowIndex: params.rowIndex,
        rowId: params.data.rowId,
      },
    });
    params.api.redrawRows({ rowNodes: [params.node] });
  };

  const onDragStart = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        card: params.data.cards.find((card: ICard) => card.stage === columnId),
        rowId: params.data.rowId,
        rowIndex: params.rowIndex,
      })
    );
  };
  const card = params.data.cards.find((card: ICard) => card.stage === columnId);
  const isDraggable = !!card;

  return (
    <div
      className="drag-card"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {card && <Card draggable={isDraggable} data={card} />}
    </div>
  );
});

export default DragSourceRenderer;
