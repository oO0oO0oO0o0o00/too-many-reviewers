import { ReactNode } from "react";
import { TableViewModelItem } from "./table_viewmodel";
import { Optional } from "./utils";
import classNames from "classnames";
import { RoomView } from "./room_view";

interface CellViewProps {
  items: TableViewModelItem[],
  selected: boolean,
  onClick: () => void,
}

export function CellView({ items, selected, onClick }: CellViewProps): Optional<ReactNode> {
  let body: ReactNode[]
  switch (items.length) {
    case 0:
      return undefined;
    case 1:
      body = [<RoomView className='cell-full' key='c0' item={items[0]}/>];
      break;
    case 2:
      body = [
        <RoomView className='cell-half' key='c0' item={items[0]}/>,
        <div className='cell-d-v' key='cdm'></div>,
        <RoomView className='cell-half' key='c1' item={items[1]}/>,
      ];
      break;
    case 3:
      body = [
        <RoomView className='cell-half' key='c0' item={items[0]}/>,
        <div className='cell-d-v' key='cdm'></div>,
        <div className='cell-half' key='c1'>
          <RoomView className='cell-quarter' key='c10' item={items[1]}/>
          <div className='cell-d-h' key='cd1'></div>
          <RoomView className='cell-quarter' key='c11' item={items[2]}/>
        </div>,
      ];
      break;
    default:
      body = [
        <div className='cell-half' key='c0'>
          <RoomView className='cell-quarter' key='c00' item={items[0]}/>
          <div className='cell-d-h' key='cd0'></div>
          <RoomView className='cell-quarter' key='c01' item={items[1]}/>
        </div>,
        <div className='cell-d-v' key='cdm'></div>,
        <div className='cell-half' key='c1'>
          <RoomView className='cell-quarter' key='c10' item={items[2]}/>
          <div className='cell-d-h' key='cd1'></div>
          <RoomView className='cell-quarter' key='c11' item={items[3]}/>
        </div>,
      ];
      break;
  }
  return <div className='cell-container-wrapper'>
    <div className={classNames({
      'cell-container-border': true,
      'selected': selected,
    })}>
      <div className='cell-container' onClick={() => onClick()}>
        {body}
      </div>
    </div>
  </div>;
}
