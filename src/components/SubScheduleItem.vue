<template>
  <div class="sub-schedule-item pointer" @click="handlePlay">
    <template v-if="style === 'light'">
      <div class="p-t-24">
        <div class="light-body p-l-24 p-t-16 p-r-16">
          <img :src="item.avatar" alt="" class="avatar" />
          <div class="row" flex>
            <div class="content p-l-121" flex-box="1">
              <p class="name">{{ item.guestName }}</p>
              <p class="work m-t-8">{{ item.work }}</p>
            </div>
            <img
              v-show="showDownloadButton && !cacheFile"
              src="/images/icon_download.png"
              class="download"
              @click.stop="handleCache"
            />
          </div>
          <div class="row m-t-16" flex="cross:center">
            <span class="time">{{ duration }}</span>
            <span class="name m-l-16 text-hidden" flex-box="1">
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div :class="['header', style]" flex="cross:center">
        <span class="time" flex-box="1">{{ duration }}</span>
        <img
          v-show="showDownloadButton && !cacheFile"
          src="/images/icon_download_white.png"
          class="download"
          @click.stop="handleCache"
        />
      </div>
      <div class="body" flex>
        <img :src="item.avatar" alt="" class="avatar" />
        <div class="content m-l-16" flex-box="1">
          <p class="guest">{{ item.guestName }}</p>
          <p class="name text-hidden m-t-8">
            {{ item.name }}12312312312312312312312321313
          </p>
          <p class="work m-t-16">{{ item.work }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cacheFile: null,
    };
  },
  created() {
    this.loadCache();
  },
  computed: {
    ...mapGetters(['style']),
    duration() {
      return `${this.item.startTime}-${this.item.endTime}`;
    },
    showDownloadButton() {
      return !!this.item.ppt;
    },
  },
  methods: {
    async handlePlay() {
      if (this.cacheFile) {
        console.log('打开缓存');
        await this.$ipcRenderer.invoke('channel', {
          type: 'openCacheFile',
          data: { url: this.cacheFile },
        });
      } else if (this.item.ppt) {
        const url = this.item.ppt + '?id=' + this.item.id;
        this.$ipcRenderer.invoke('channel', {
          type: 'preview',
          data: { url },
        });
      }
    },
    async handleCache() {
      if (this.item.ppt) {
        const url = this.item.ppt + '?id=' + this.item.id;
        const hide = this.$message.loading('正在缓存，请稍后...', 0);
        try {
          await this.$ipcRenderer.invoke('channel', {
            type: 'cacheFile',
            data: { url },
          });
          console.log('缓存成功');
          hide();
          this.$message.success('缓存成功！');
          this.loadCache();
        } catch (error) {
          console.log('缓存失败');
          hide();
          this.$message.error('缓存失败！');
        }
      }
    },
    async loadCache() {
      this.$lowdb.read();
      const key = `cache${this.item.id}`;
      const url = this.$lowdb.get(key).value();
      this.cacheFile = url;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 48px;
  padding: 8px 16px;
  color: #fff;
  font-size: 24px;
  font-family: OpenSans-SemiBold, OpenSans;
  font-weight: 600;
  line-height: 32px;
  &.red {
    background-color: #f60f0f;
  }
  &.blue {
    background-color: #2267e5;
  }
  .download {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
.body {
  padding: 16px;
  padding-top: 20px;
  background-color: #e5e5e5;
  .avatar {
    width: 102px;
    min-width: 102px;
    height: 102px;
    border-radius: 4px;
  }
  .content {
    width: 260px;
  }
  .guest {
    font-size: 24px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 32px;
  }
  .name {
    font-size: 20px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    width: 100%;
  }
  .work {
    font-size: 16px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }
}
.light-body {
  background: rgba(255, 255, 255, 1) rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
  position: relative;
  height: 142px;
  .avatar {
    position: absolute;
    top: -24px;
    left: 24px;
    width: 102px;
    height: 102px;
    border-radius: 4px;
  }
  .content {
    .name {
      font-size: 24px;
      font-family: PingFangTC-Semibold, PingFangTC;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
    }
    .work {
      font-size: 16px;
      font-family: PingFangTC-Regular, PingFangTC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 22px;
    }
  }
  .download {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  .time {
    font-size: 24px;
    font-family: OpenSans-SemiBold, OpenSans;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 32px;
    min-width: 140px;
  }
  .name {
    font-size: 20px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    width: 100%;
    display: block;
  }
}
</style>