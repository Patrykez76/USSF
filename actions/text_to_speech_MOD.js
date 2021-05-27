module.exports = {
  name: 'Text To Speech',
  section: 'Messaging',

  subtitle (data) {
    return 'Make your Discord bot talk.'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Audio URL'
    return ([data.varName, dataType])
  },

  fields: ['text', 'lang', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <p>This action can not deal with texts which are over than 200 characters.</p>
</div><br>
<div style="width: 90%;">
  Message (to be converted to speech):<br>
  <input id="text" class="round" type="text">
</div><br>
<div style="width: 90%;">
  Language:<br>
  <input id="lang" class="round" type="text">
</div><br>
<div style="float: left; width: 35%;">
  Store Audio URL In:<br>
  <select id="storage" class="round">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div>`
  },

  init () {},

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const text = this.evalMessage(data.text, cache)
    const language = this.evalMessage(data.lang, cache)
    const Mods = this.getMods()
    const tts = Mods.require('google-tts-api')
    const play = await tts.getAudioUrl(text, {
      lang: language,
      slow: false,
      host: 'https://translate.google.com'
    })
    this.storeValue(play, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
