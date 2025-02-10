import Image from 'next/image'
import { ReactNode } from "react";
import { TableViewModelItem } from "./table_viewmodel";
import { Optional } from "./utils";
import avatars from '../public/avatars.png'
import { Hashable$hashValue } from './equatables';

interface RoomViewProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TableViewModelItem,
}

export function RoomView({ item, className }: RoomViewProps): Optional<ReactNode> {
  if (item == undefined) { return undefined; }
  if (typeof item === 'string') {
    let colors = [
      "blue", "green", "darkred",
      "purple", "orange", "teal",
      "navy", "darkgoldenrod", "darkblue",
    ];
    let color = colors[Hashable$hashValue(item) % colors.length];
    return <div className={className} style={{
      backgroundColor: color,
    }}>{item}</div>
  } else if (Array.isArray(item)) {
    return <div className={className}>
      <div className='avatar-wrapper'>
        <Image src={avatars} alt='avatars' style={{
          top: `${-item[0] * 100}%`,
          left: `${-item[1] * 100}%`,
        }}/>
      </div>
    </div>
  }
  return undefined;
}
