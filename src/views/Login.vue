
<template>
  <div class="page-login">
    <div class="header">
      <h1 class="heading">欢迎登录</h1>
    </div>
    <div class="panel">
      <div class="panel__header">
        <div class="logo"></div>
      </div>
      <form class="form form--login" action>
        <div class="form-item" :class="{active: act_index===1, error:errors.has('co_id')}">
          <label for="co_id">公司编号：</label>
          <input
            v-validate="{required: true, max:6, min:4}"
            @focus="act_index=1"
            type="number"
            name="co_id"
            v-model="co_id"
          >
        </div>

        <div class="form-item" :class="{active: act_index===2, error:errors.has('em_id')}">
          <label for="em_id">员工编号：</label>
          <input
            v-validate="{required: true, max:14, min:4}"
            @focus="act_index=2"
            type="number"
            name="em_id"
            v-model="em_id"
          >
        </div>

        <div class="form-item" :class="{active: act_index===3, error:errors.has('em_pwd')}">
          <label for="em_pwd">登录密码：</label>
          <input
            v-validate="{required: true, max:6, min:4}"
            @focus="act_index=3"
            type="password"
            name="em_pwd"
            v-model="em_pwd"
          >
        </div>

        <div class="checkbox-group">
          <div class="checkbox-item" @click="remPwdSet" :class="{active: rmb_pwd }">
            <span class="iconfont" :class="rmb_pwd? 'icon-check-square':'icon-border'"></span>
            <span>记住密码</span>
          </div>
          <div class="checkbox-item" @click="autoLoginSet" :class="{active: auto_logon }">
            <span class="iconfont" :class="auto_logon? 'icon-check-square':'icon-border'"></span>
            <span>自动登录</span>
          </div>
        </div>
      </form>
    </div>

    <div class="panel">
      <button class="btn btn-form" @click="loginBtnClick">登 录</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Indicator, Toast } from "mint-ui";

import "../assets/font/iconfont.css";
import { setTimeout } from "timers";

export default {
  name: "login",
  data() {
    return {
      act_index: 1,
      co_id: "",
      em_id: "",
      em_pwd: "",
      rmb_pwd: false,
      auto_logon: false
    };
  },
  mounted() {
    let data = JSON.parse(localStorage.getItem("Login_data"));
    if (data) {
      this.rmb_pwd = data.rmb_pwd;
      this.auto_logon = data.auto_logon;
      this.co_id = data.rmb_pwd;
      this.em_id = data.rmb_pwd;
      this.em_pwd = data.rmb_pwd;
    }

    //强制校验
    this.$validator.validate();

    if (this.auto_logon) {
      this.loginBtnClick();
    }
  },
  methods: {
    autoLoginSet() {
      this.auto_logon = !this.auto_logon;
      this.auto_logon && (this.rmb_pwd = true);
    },
    remPwdSet() {
      this.rmb_pwd = !this.rmb_pwd;
      this.rmb_pwd || (this.auto_logon = false);
    },
    loginBtnClick() {
      // this.error.any();  // boolean 如果有错误那么返回true， 否则 false；

      if (this.errors.any()) {
        console.log("有错误");
        return;
      }
      //弹出等待消息框
      Indicator.open("登录中...");
      console.log("没有错误");
      // 发送 ajax 请求，  axios
      // setTimeout(() => {
      //   Indicator.close();
      // }, 2000);

      axios
        .get("/api/login")
        .then(res => {
          // console.log(res.data);
          if (res.data.code == 1) {
            // 1、登录成功
            // 2、记住用户名密码
            localStorage.setItem(
              "Login_data",
              JSON.stringify({
                rmb_pwd: this.rmb_pwd,
                auto_logon: this.auto_logon,
                co_id: this.rmb_pwd ? this.co_id : "",
                em_id: this.rmb_pwd ? this.em_id : "",
                em_pwd: this.rmb_pwd ? this.em_pwd : ""
              })
            );
            // 3、跳转Home页面
            this.$router.push("/home");
          } else {
            //登录失败 用户名 密码 错误
            Toast({
              message: "登录失败，用户名 密码 错误",
              position: "bottom",
              duration: 5000
            });
          }
          Indicator.close();
        })
        .catch(error => {
          //登录失败 异常
          Toast({
            message: "登录异常失败",
            position: "bottom",
            duration: 5000
          });
          console.log(error);
          Indicator.close();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "@/lib/hotcss/px2rem.scss";

.page-login {
  background: $secondary;
  height: 100vh;
}
.header {
  height: px2rem(200);
  display: flex;
  flex-direction: column;
  justify-content: flex-end; // main axix end
}
.heading {
  color: $white;
  font-size: px2rem(36);
  text-align: center;
  margin-bottom: px2rem(40);
}
.panel {
  overflow: hidden;
  border-radius: px2rem(10);
  width: px2rem(600);
  margin: auto;
  background-color: $white;

  &__header {
    height: px2rem(350);
    display: flex;
    justify-content: center; // main axis center
    align-items: center; // cross axis center
  }

  &:not(:last-child) {
    margin-bottom: px2rem(30);
  }
}

.logo {
  width: px2rem(190);
  height: px2rem(190);
  background-image: url("../assets/logo.png");
  background-size: cover;
}

@mixin form-item {
  padding: 0 px2rem(30);
  color: $text-main;
}

.form {
  &--login {
    width: px2rem(500);
    margin: 0 auto;
  }
  &-item {
    @include form-item();
    border: 2px solid #000;
    border-radius: px2rem(45);
    font-size: $font-size-middle;
    line-height: px2rem(90);
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;

    label {
      text-align: left;
      width: px2rem(170);
      white-space: nowrap;
    }
    input {
      padding-left: 12px;
      vertical-align: middle;
      border: none;
    }
    // input[type="text"]:focus
    input:focus {
      outline: none;
      //border: 1px solid #58b195;
    }

    &.active {
      color: $primary;
      border: 2px solid $primary;
      input {
        color: $primary;
      }
    }
    &.error {
      color: $danger;
      border: 2px solid $danger;
      input {
        color: $danger;
      }
    }

    &:not(:last-child) {
      margin-bottom: px2rem(30);
    }
  }
}

.checkbox-group {
  @include form-item();
  display: flex;
  justify-content: space-between;
  margin-bottom: px2rem(30);

  .checkbox-item {
    &.active {
      color: $primary;
    }
    span {
      font-size: $font-size-middle;
    }
  }
}

.btn-form {
  border-radius: px2rem(10);
  font-weight: bold;
  display: block;
  width: 100%;
  font-size: $font-size-large;
  color: $primary;
  background-color: #fff;
}
</style>
