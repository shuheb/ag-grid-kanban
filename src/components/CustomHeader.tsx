import { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/chakra-ui";
import { v4 as uuidv4 } from "uuid";
import { useKanban } from "../context/KanbanContext";
const log = (type: string) => console.log.bind(console, type);
const CustomHeader = (props: any) => {
  const { dispatch } = useKanban();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const eMenu = useRef<any>();
  const eLabel = useRef<any>();
  const eText = useRef<any>();
  const eFilter = useRef<any>();
  const eSortIndicator = useRef<any>();
  const eSortOrder = useRef<any>();
  const eSortAsc = useRef<any>();
  const eSortDesc = useRef<any>();
  const eSortMixed = useRef<any>();
  const eSortNone = useRef<any>();

  const schema: any = {
    type: "object",
    required: ["task", "user"],
    properties: {
      task: { type: "string", title: "Task", default: "A new task" },
      user: {
        type: "string",
        title: "User",
        enum: ["Shuheb Ahmed", "Stephen Cooper", "Bamdad Fard"],
        addable: true,
      },
      tags: {
        title: "Tags",
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          title: "tag",
          enum: ["Product", "Design", "Engineering"],
        },
      },
    },
  };

  const Menu = (
    <span
      ref={eMenu}
      className="ag-header-icon ag-header-cell-menu-button"
      aria-hidden="true"
    >
      <span
        className="ag-icon ag-icon-menu"
        unselectable="on"
        role="presentation"
      ></span>
    </span>
  );

  const SortIndicator = (
    <span className="ag-sort-indicator-container" ref={eSortIndicator}>
      <span
        ref={eSortOrder}
        className="ag-sort-indicator-icon ag-sort-order ag-hidden"
        aria-hidden="true"
      ></span>
      <span
        ref={eSortAsc}
        className="ag-sort-indicator-icon ag-sort-ascending-icon ag-hidden"
        aria-hidden="true"
      >
        <span
          className="ag-icon ag-icon-asc"
          unselectable="on"
          role="presentation"
        ></span>
      </span>
      <span
        ref={eSortDesc}
        className="ag-sort-indicator-icon ag-sort-descending-icon ag-hidden"
        aria-hidden="true"
      >
        <span
          className="ag-icon ag-icon-desc"
          unselectable="on"
          role="presentation"
        ></span>
      </span>
      <span
        ref={eSortMixed}
        className="ag-sort-indicator-icon ag-sort-mixed-icon ag-hidden"
        aria-hidden="true"
      >
        <span
          className="ag-icon ag-icon-none"
          unselectable="on"
          role="presentation"
        ></span>
      </span>
      <span
        ref={eSortNone}
        className="ag-sort-indicator-icon ag-sort-none-icon ag-hidden"
        aria-hidden="true"
      >
        <span
          className="ag-icon ag-icon-none"
          unselectable="on"
          role="presentation"
        ></span>
      </span>
    </span>
  );

  const Filter = (
    <span
      ref={eFilter}
      className="ag-header-icon ag-header-label-icon ag-filter-icon ag-hidden"
      aria-hidden="true"
    >
      <span
        className="ag-icon ag-icon-filter"
        unselectable="on"
        role="presentation"
      ></span>
    </span>
  );

  const Text = (
    <span ref={eText} className="ag-header-cell-text">
      {props.displayName}
    </span>
  );

  const onSubmit = (ev: any) => {
    const formData = ev.formData;
    formData.stage = props.column.getColId();
    formData.id = uuidv4();
    dispatch({ type: "add", data: formData });
    onClose();
  };
  return (
    <>
      <div className="ag-cell-label-container" role="presentation">
        {Menu}
        <div ref={eLabel} className="ag-header-cell-label" role="presentation">
          {Text}
          <Button style={{ marginLeft: "auto" }} onClick={onOpen}>
            + New
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Task</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Form
                  schema={schema}
                  validator={validator}
                  onChange={log("changed")}
                  onSubmit={onSubmit}
                  onError={log("errors")}
                />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
          {Filter}
          {SortIndicator}
        </div>
      </div>
    </>
  );
};

export default CustomHeader;
