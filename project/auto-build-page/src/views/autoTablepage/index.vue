<template>
  <div class="deduction">
    <header>自动生成表格页</header>
    <main>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="props">
            <pre v-html="formatOther(props.row)"></pre>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in tableDataHeader" :key="index" :prop="item.prop" :label="item.col">
          <template slot-scope="scope">
            {{scope.row[scope.column.property]}}
            <!-- {{scope.row}}
            {{scope.column.property}} -->
            <!-- 渲染对应表格里面的内容 -->
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import axios from "axios";
const CONFIG={
  method:"GET",
  geturl:"http://test.req/getlist",
};
export default {
  data() {
    return {
      tableData: [],
      tableDataHeader: [],

    };
  },
  methods: {
    formatOther(row) {
      return JSON.stringify(row, null, 2);
    },
    getList(params={}) {
      axios({
        method: CONFIG.method,
        url: CONFIG.geturl,
        data: params
      }).then(res=>{ // 后端返回的数据需要按照这种格式
        console.log(res);
        this.tableData=res.data.tableData;
        this.tableDataHeader=res.data.tableDataHeader;
      });
    }
  },
  mounted(){
    this.getList();
  }
};
</script>
