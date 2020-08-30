export class Column {
  constructor(idx, width, left, cubedHeight, infoWidth) {
    this.idx = idx;
    this.groups = [];
    this.items = [];
    this.height = 0;
    this.width = width;
    this.left = left;
    this.cubedHeight = cubedHeight;
    this.infoWidth = infoWidth || 0;
  }

  addGroup(group) {
    this.addGroups([group]);
  }

  addGroups(groups) {
    this.groups = this.groups.concat(groups);
    groups.forEach(group => {
      group.columnIdx = this.idx;
      group.Column = this;
    });
  }

  get totalWidth() {
    return this.width + this.infoWidth;
  }

  get scheme() {
    return {
      idx: this.idx,
      groups: this.groups.map(group => group.scheme),
      items: this.groups
        .map(group => {
          return group.items.map(item => {
            return { ...item.scheme, groupIdx: group.idx };
          });
        })
        .flat(),
      width: this.width,
      height: this.height,
    };
  }
}
