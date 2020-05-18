export default class Base {
    set $asyncData(data: any) {
        if (process&&process.server) return;
        (<any>Base).data = data;
      }
    
      /**
       * 仅限客户端执行
       * 获取响异步应式数据数据
       */
      get asyncData(): any {
        if (process&&process.server) return;
        setTimeout(() => {
          (<any>Base).data = null;
        });
        return (<any>Base).data;
      }
}