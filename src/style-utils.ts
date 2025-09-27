import { COLON, PROPERTY_MAP, PropertyName } from "@/constants/style";

function resolvePropName(prop: PropertyName) {
  const propertyName = PROPERTY_MAP.get(prop);
  if (propertyName == null) {
    throw new Error("could'nt resolve property name");
  }
  return propertyName;
}

function makeLine(prop: PropertyName, value: string) {
  return `${resolvePropName(prop)}${COLON} ${value};`;
}

function makePropPart(prop: PropertyName) {
  return `${resolvePropName(prop)}${COLON}`;
}

export function alignItemsCenterStyle() {
  return makeLine(PropertyName.ALIGN_ITEMS, "center");
}

export function backgroundTransparentStyle() {
  return makeLine(PropertyName.BACKGROUND, "transparent");
}

export function backgroundInheritStyle() {
  return makeLine(PropertyName.BACKGROUND, "inherit");
}

export function boxSizingBorderBoxStyle() {
  return makeLine(PropertyName.BOX_SIZING, "border-box");
}

export function colorInheritStyle() {
  return makeLine(PropertyName.COLOR, "inherit");
}

export function cursorPointerStyle() {
  return makeLine(PropertyName.CURSOR, "pointer");
}

export function displayGridStyle() {
  return makeLine(PropertyName.DISPLAY, "grid");
}

export function displayNoneStyle() {
  return makeLine(PropertyName.DISPLAY, "none");
}

export function justifyContentCenterStyle() {
  return makeLine(PropertyName.JUSTIFY_CONTENT, "center");
}

export function justifyContentEndStyle() {
  return makeLine(PropertyName.JUSTIFY_CONTENT, "end");
}

export function positionRelativeStyle() {
  return makeLine(PropertyName.POSITION, "relative");
}

export function positionAbsoluteStyle() {
  return makeLine(PropertyName.POSITION, "absolute");
}

export function positionFixedStyle() {
  return makeLine(PropertyName.POSITION, "fixed");
}

export function marginBlockStartZeroStyle() {
  return makeLine(PropertyName.MARGIN_BLOCK_START, "0");
}

export function marginBlockEndZeroStyle() {
  return makeLine(PropertyName.MARGIN_BLOCK_END, "0");
}

export function paddingInlineStartZeroStyle() {
  return makeLine(PropertyName.PADDING_INLINE_START, "0");
}

export function listStyleTypeNoneStyle() {
  return makeLine(PropertyName.LIST_STYLE_TYPE, "none");
}

export function zIndexInfinityStyle() {
  return makeLine(PropertyName.Z_INDEX, "calc(infinity)");
}

// properties go below

export function textAlignPropertyStyle() {
  return makePropPart(PropertyName.TEXT_ALIGN);
}

export function boxShadowPropertyStyle() {
  return makePropPart(PropertyName.BOX_SHADOW);
}

export function borderRadiusPropertyStyle() {
  return makePropPart(PropertyName.BORDER_RADIUS);
}

export function fontSizePropertyStyle() {
  return makePropPart(PropertyName.FONT_SIZE);
}

export function gridTemplateColumnsPropertyStyle() {
  return makePropPart(PropertyName.GRID_TEMPLATE_COLUMNS);
}

export function gridTemplateRowsPropertyStyle() {
  return makePropPart(PropertyName.GRID_TEMPLATE_ROWS);
}

export function justifyContentPropertyStyle() {
  return makePropPart(PropertyName.JUSTIFY_CONTENT);
}

export function alignItemsPropertyStyle() {
  return makePropPart(PropertyName.ALIGN_ITEMS);
}

export function maxWidthPropertyStyle() {
  return makePropPart(PropertyName.MAX_WIDTH);
}

export function maxHeightPropertyStyle() {
  return makePropPart(PropertyName.MAX_HEIGHT);
}

export function minWidthPropertyStyle() {
  return makePropPart(PropertyName.MIN_WIDTH);
}

export function minHeightPropertyStyle() {
  return makePropPart(PropertyName.MIN_HEIGHT);
}

export function lineHeightPropertyStyle() {
  return makePropPart(PropertyName.LINE_HEIGHT);
}
