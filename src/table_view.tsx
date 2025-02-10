import { Button, Center, Container, Divider, Group, Paper, Space, Stack, Text } from '@mantine/core';
import { useImmer } from "use-immer";
import { PathSegmentKind, TableViewModel } from "./table_viewmodel";
import { Optional } from './utils';
import { ReactNode } from 'react';
import { Pair } from './pair';
import { CellView } from './cell_view';
import { CopyBlock } from 'react-code-blocks';

function generate(): TableViewModel {
  return TableViewModel.generate(5, 6);
}

export default function TableView(): ReactNode {
  let [viewModel, setViewModel] = useImmer<TableViewModel>(generate);
  let rows = viewModel.rowIndices.map((rowId) => {
    let cols = viewModel.colIndices.map((colId) =>
      <div className='cell-grid zstack' key={`div-${colId}`}>
        <SegmentView kind={viewModel.pathMask?.[rowId][colId]} key={`seg-${colId}`}/>
        <CellView 
          items={viewModel.items[rowId][colId]}
          selected={viewModel.selected?.equalsTo(new Pair(rowId, colId)) ?? false}
          onClick={() => setViewModel((viewModel) => {
            viewModel.handleClick(rowId, colId, setViewModel);
          })} 
          key={`cell-${colId}`} />
      </div>
    );
    return <Group key={`row-${rowId}`} gap={0}>{cols}</Group>
  });
  return <Container>
    {/* <Group>
      {['horizontal',
'vertical',
'up',
'left',
'down',
'right',
'upLeft',
'downLeft',
'upRight',
'downRight',].map((k) => <SegmentView kind={k as any} style={{
  width: 40, height: 40
}} key={k}/>)}
    </Group> */}
    
    <Center><Stack gap={0}>{rows}</Stack></Center>
    <Space h="md"/>
    <Center>
      <Button onClick={() => setViewModel(generate())}>Restart</Button>
    </Center>
    <Space h="md"/>
    <Paper shadow="xs" p="xl">
      <Text>想要追鼠标的小猫?</Text>
      <Text> - 在你的 Web 页面使用：<a href="https://github.com/adryd325/oneko.js" target='_blank'>https://github.com/adryd325/oneko.js</a></Text>
      <Text> - 终端执行以下命令安装 Mac 版</Text>
      <CopyBlock
    text='bash -c "$(curl -L https://github.com/oO0oO0oO0o0o00/neko-mac/releases/download/1.1/install-neko.sh)"'
    language='bash'
    showLineNumbers={false}
    codeBlock
  />
    </Paper>
    <Space h="md"/>
  </Container>
}

interface SegmentViewProps extends React.HTMLAttributes<HTMLDivElement> {
  kind: Optional<PathSegmentKind>,
}

const kSegmentPaths = {
  horizontal: "M 0,25 H 50",
  vertical: "M 25,0 V 50",
  up: "M 25,25 V 0",
  left: "M 25,25 H 0",
  down: "M 25,25 V 50",
  right: "M 25,25 H 50",
  upLeft: "M 0,25 H 10 Q 25,25,25,10 V 0",
  downLeft: "M 0,25 H 10 Q 25,25,25,40 V 50",
  upRight: "M 50,25 H 40 Q 25,25,25,10 V 0",
  downRight: "M 50,25 H 40 Q 25,25,25,40 V 50",
};

function SegmentView({ kind }: SegmentViewProps): Optional<ReactNode> {
  if (kind == undefined) { return undefined; }
  return <svg viewBox='0 0 50 50' xmlns="http://www.w3.org/2000/svg" className='segment'>
    <path d={kSegmentPaths[kind]}/>
  </svg>
}
