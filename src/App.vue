<template>
  <div id="app">
    <div>
      <h2>Nbb.macro.translator</h2>
    </div>
    <div>
      <h3>
        源语言
        <button class="langs" :class="solang === it ? 'active' : '' " v-for="it in langs" :key="it" :value="it" :name="it" @click="solang = it">{{ it }}</button>
      </h3>
    </div>
    <div class="footer">
      <p>
        <span class="spanStyle1">使用须知：由于目前正则匹配不完善，若是有转换错误，反馈时请务必提供原有宏</span>
      </p>
    </div>
    <div style="width:100%; text-align: left; padding: 10px;">
      <textarea v-model="input"></textarea>
    </div>
    <div style="width:100%; padding: 10px;">
      <button class="doit" @click="doit">转换</button>
    </div>
    <div style="width:100%; text-align: left; padding: 10px;">
      <button class="langs" :class="showlang === it ? 'active' : '' " v-for="it in langs" :key="it" :value="it" :name="it" @click="showlang = it">{{ it }}</button>
    </div>
    <div style="width:100%; text-align: left; padding: 10px;">
      <textarea v-model="out[showlang]" readonly></textarea>
    </div>
    <div class="footer">
      <p>
        DC：
        <span class="spanStyle1">mana - Nbb Strife</span>
        Github：
        <a target="_blank" title="github" href="https://github.com/ffxiv-cn/nbb.macro">开源</a>
        微博：
        <a target="_blank" href="https://weibo.com/u/3247846021">NbbJack</a>
      </p>
      <p>Copyright 2016-2019 FFXIV.CN &amp; FFXIV.XIN All rights reserved.</p>
      <p>Data,image FINAL FANTASY XIV©2010 - 2019 SQUARE ENIX CO., LTD. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import Action from './statics/Action.json'
import CraftAction from './statics/CraftAction.json'

export default {
  name: 'app',
  components: {},
  data () {
    return {
      action: Action,
      craftaction: CraftAction,
      regUtf: /\s+[^\\s]+\s+/,
      regU: /\/(ac|action|aaction|gaction|generalaction)[\s]+((\w)|([^\\s]{2}))[\s]/,
      regEn: /\/(ac|action|aaction|gaction|generalaction)[\s]+(([\w|[\u3000-\u303F]+|[\u3040-\u9FAF]+|[\uFF00-\uFFEF]+|[\u4E00-\u9FAF]+|[\u2605-\u2606]+|[\u2190-\u2195]+|[\u203B]+)|"([^"]+)")?.*/,
      langs: ['ja', 'en', 'chs'],
      solang: 'ja',
      showlang: 'ja',
      out: { 'ja': '', 'en': '', 'chs': '' },
      input: '',
      regObjEn: null,
      regObjUTF: null
    }
  },
  mounted () {
    this.regObjEn = new RegExp(this.regEn, 'i')
    this.regObjUTF = new RegExp(this.regUtf, 'i')
  },
  methods: {
    doit () {
      let out = { 'ja': [], 'en': [], 'chs': [] }
      let arr = this.input.split('\n')
      for (var i = 0; i < arr.length; i++) {
        let name = ''
        let txt = arr[i]
        name = this.regObjEn.exec(txt)
        /* if (this.solang === 'en') {
        } else {
          name = this.regObjUTF.exec(txt)
        } */
        console.log('doit.exec', txt, name)
        if (name !== undefined && name !== null) {
          let actName = this.solang === 'en' || txt.indexOf('"') > 0 ? name[4] : name[3]
          // let actName = name[3]
          let act = this.findByName(actName)
          if (act === null) {
            out.ja.push('*匹配失敗*')
            out.en.push('*匹配失敗*')
            out.chs.push('*匹配失敗*')
          } else {
            out.ja.push(txt.replace(actName, act.ja))
            out.en.push(txt.replace(actName, txt.indexOf('"') > 0 ? act.en : `"${act.en}"`))
            out.chs.push(txt.replace(actName, act.chs !== '' ? act.chs : actName))
          }
        } else {
          out.ja.push(txt)
          out.en.push(txt)
          out.chs.push(txt)
        }
      }
      this.$set(this.out, 'ja', out.ja.join('\n'))
      this.$set(this.out, 'en', out.en.join('\n'))
      this.$set(this.out, 'chs', out.chs.join('\n'))
    },
    tranNo () {

    },
    findByName (name) {
      let act = null
      name = name.replace(/"/g, '')
      for (var id in this.craftaction) {
        let t = this.craftaction[id]
        // console.log(t)
        if (t[this.solang] === name) {
          act = t
          break
        }
      }

      if (act !== null) return act

      for (var id2 in this.action) {
        let t = this.action[id2]
        // console.log(id2, t[this.solang], name, t[this.solang] === name)
        if (t[this.solang] === name) {
          act = t
          break
        }
      }
      // if (act === null) console.log(this.solang, name)
      return act
    }
  }
}
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  -webkit-border-radius: 4px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: hsla(0, 0%, 80%, 0.5);
  -webkit-border-radius: 4px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: hsla(0, 0%, 80%, 0.5);
  -webkit-border-radius: 4px;
}

html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #2c3e50;
}
#app {
  display: block;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 1000px;
  margin: auto;

  .langs {
    background-color: transparent;
    border: white solid 1px;
    border-radius: 5px;
    color: white;
    padding: 3px;
    margin: 0 3px;
    width: 35px;
  }
  .langs.active {
    border: rgb(0, 187, 0) solid 1px;
  }

  textarea {
    width: calc(100% - 22px);
    padding: 10px;
    border-radius: 5px;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    height: 225px;
    overflow: hidden;
    resize: none;
  }

  .doit {
    width: 100%;
    background-color: #0f8db1;
    border: #474747 solid 1px;
    border-radius: 5px;
    color: white;
    height: 30px;
  }

  .footer {
    text-align: left;
    font-size: 12px;
    padding: 0 10px;
    p {
      margin: 5px 0;
    }
    a {
      color: #19be6b;
      background: transparent;
      text-decoration: none;
      outline: none;
      cursor: pointer;
      transition: color 0.2s ease;
    }
  }

  .spanStyle1 {
    color: #ff6c00;
  }
}
</style>
