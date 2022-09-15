import React, { createContext, ReactNode, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

type State = {
  rows: KanbanData[];
};

type Action =
  | { type: "add"; data: KanbanData }
  | {
      type: "update";
      from: {
        rowId?: string;
        cardId?: string;
        stage?: string;
        rowIndex?: number;
      };
      to: {
        rowId?: string;
        cardId?: string;
        stage?: string;
        rowIndex?: number;
      };
    };

type Dispatch = (action: Action) => void;

type Props = {
  children: ReactNode;
};

const DEFAULT_VALUE = {
  rows: [],
  dispatch: () => {},
};

type CarouselContext = {
  rows: KanbanData[];
  dispatch: Dispatch;
};

export type Stage = "todo" | "in_progress" | "unassigned";

export type KanbanData = {
  rowId: string;
  cards: ICard[];
};

export type ICard = {
  cardId?: string;
  stage?: Stage;
  assigned?: boolean;
  tags?: string[];
  user: string;
  task?: string;
  unassigned?: boolean;
};

const KanbanContext = createContext<CarouselContext>(DEFAULT_VALUE);

const reducer = (state: State, action: Action): State => {
  console.group(action.type);
  console.log(action);
  console.groupEnd();
  switch (action.type) {
    case "update":
      const newState = {
        ...state,
        rows: state.rows.map((row) => ({ ...row })),
      };
      const card = getCard(state, action.from) as ICard;
      card.stage = action.to.stage as Stage;
      const toCardsRow = state.rows.find(
        (row) => row.rowId === action.to.rowId
      )?.cards;
      toCardsRow?.push(card);

      return newState;
    case "add": {
      return { ...state, rows: [...state.rows, action.data] };
    }
    default:
      return state;
  }
};

const getCard = (
  { rows }: State,
  from: {
    rowId?: string;
    cardId?: string;
    stage?: string;
    rowIndex?: number;
  }
) => {
  const cards = rows.find((row) => row.rowId === from.rowId)?.cards;
  const cardData = cards?.find((card) => card.stage === from.stage);
  return cardData;
};

const initialState: State = {
  rows: [
    {
      rowId: uuidv4(),
      cards: [
        {
          cardId: uuidv4(),
          stage: "in_progress",
          task: "Tweak Blog Post",
          tags: ["Product", "Feature"],
          user: "Shuheb Ahmed",
        },
      ],
    },
    {
      rowId: uuidv4(),
      cards: [
        {
          cardId: uuidv4(),
          stage: "in_progress",
          task: "Grid Component",
          tags: ["Engineering", "Bug"],
          user: "Stephen Cooper",
        },
      ],
    },
    // {
    //   id: uuidv4(),
    //   unassigned: true,
    //   user: "Unassigned",
    //   stage: "unassigned",
    // },
  ],
};

const KanbanProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { rows } = state;

  const value = { rows, dispatch };
  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

const useKanban = () => {
  const context = React.useContext(KanbanContext);

  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }

  return context;
};

export { KanbanProvider, KanbanContext, useKanban };
