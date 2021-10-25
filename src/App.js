import React, { useRef } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

const Rectangle = React.forwardRef(function Rectangle(
  { shapeProps, onSelect, onChange, isSelected },
  trRef
) {
  const shapeRef = React.useRef();

  React.useEffect(() => {
    const oldNodes = trRef.current.nodes();
    let newNodes = [];
    if (isSelected) {
      newNodes = oldNodes.concat(shapeRef.current);
    } else {
      newNodes = oldNodes.filter((node) => shapeRef.current !== node);
    }
    trRef.current.nodes(newNodes);
    trRef.current.getLayer().batchDraw();
  }, [isSelected]);

  const handleDrag = (e) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransform = (e) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      // set minimal value
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    });
  };

  const handleSelect = () => {
    onSelect(shapeProps.id);
  };

  return (
    <React.Fragment>
      <Rect
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
      />
    </React.Fragment>
  );
});

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
  {
    x: 350,
    y: 190,
    width: 100,
    height: 100,
    fill: "orange",
    id: "rect3",
  },
];

const App = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedIDs, selectNodes] = React.useState([]);

  console.log(selectedIDs);

  const layerRef = useRef();
  const trRef = useRef();
  const Konva = window.Konva;
  const selectionRef = useRef();
  const selection = useRef({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectNodes([]);
    }
  };

  const onSelect = (id) => {
    selectNodes([id]);
  };

  // const handleChangeNodes = React.useCallback((nodes) => {
  //   setTrNodes(nodes);
  // }, []);

  const onMouseDown = (e) => {
    console.log("mouse down");
    // const isElement = e.target.findAncestor(".elements-container");
    // const isTransformer = e.target.findAncestor("Transformer");
    console.log(e.target);
    if (e.target !== e.target.getStage()) {
      return;
    } else {
      selectNodes([]);
    }
  };
  const onMouseMove = (e) => {};
  const onMouseUp = (e) => {
    console.log("mouse release");
  };

  const onClick = (e) => {
    console.log(e.target);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <Layer>
        <Rect ref={selectionRef} fill="rgba(0,0,255,0.5)" visible={false} />
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              ref={trRef}
              key={i}
              shapeProps={rect}
              onSelect={onSelect}
              isSelected={selectedIDs.findIndex((id) => id === rect.id) > -1}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default App;
