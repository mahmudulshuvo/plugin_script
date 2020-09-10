// version 2.4
// Active Installations
// Bugfix negetive tip amount
// Translations fix
// is_draft and remove child
// resolve jQuery conflict, wix issue
// Show disable on completed

var randExtension = Math.floor(Math.random() * 1000)
randExtension = randExtension.toString()
var tipBoxSlugList = { current: '' }
var whydonateSlugs={}
localStorage.setItem('checkFirstTime', true)
var jQueryTemp=undefined;

var classArray = document.getElementsByClassName('widget')
if (classArray.length > 1) {
  var widgetDiv = classArray[classArray.length - 1]
} else {
  var widgetDiv = classArray[0]
}

widgetDiv.id = widgetDiv.dataset.slug + '&&&' + randExtension
widgetDiv.dataset.slug = widgetDiv.dataset.slug + '&&&' + randExtension

var donateButton = document.createElement('BUTTON')
var fundraiserInfo = {}
var widgetOption = ''

//*********** style added snnipet */

var head = document.getElementsByTagName('head')[0]
var style = document.createElement('link')
//style.href = 'style.css'
// style.href='https://codepen.io/mahmudulshuvo/pen/xxGyvQy.css'
style.href='https://res.cloudinary.com/dxhaja5tz/raw/upload/script_style.css'
style.type = 'text/css'
style.rel = 'stylesheet'
head.appendChild(style)

// var getFundraiserLocalValue = async (url, slug) => {
//   const res = await fetch(url)
//   const json = await res.json()
//   console.log('json values ', json)
//   setValues(json, slug)
// }

loadWidget()

function css(element, property) {
  return window.getComputedStyle(element, null).getPropertyValue(property)
}

function addFontAwesome() {
  var span = document.createElement('span')
  span.className = 'faspan'
  span.style.display = 'none'
  document.body.insertBefore(span, document.body.firstChild)

  if (css(span, 'font-family') !== 'FontAwesome') {
    // add a local fallback
    var fontAwesomeCss = document.createElement('link')
    fontAwesomeCss.href =
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
    fontAwesomeCss.type = 'text/css'
    fontAwesomeCss.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(fontAwesomeCss)
  }
  document.body.removeChild(span)
}

function loadWidget() {
  widgetOption = widgetDiv.getAttribute('value')
  var slug = widgetDiv.dataset.slug
  var lang = widgetDiv.dataset.lang
  var card = null
  if (widgetDiv.dataset.card) {
    card = widgetDiv.dataset.card
  }
  // console.log('card option ', card)
  var option = 0
  if (widgetOption === 'show-with-image') {
    option = 1
    designWidget(1)
    createModal(slug)
  } else if (widgetOption === 'donation-widget') {
    option = 3
    designWidget(3)
    createModal(slug)
  } else if (widgetOption === 'donation-form+image') {
    option = 2
    designWidget(2)
  } else if (widgetOption === 'donation-form+widget') {
    option = 4
    designWidget(4)
  } else {
    // Do nothing
  }
  // if (window.jQuery) {
  //   // Do nothing
  // } else {
  //   addJquery()
  // }
  addJquery()
  addFontAwesome()

  var url = makeUrl()
  getFundraiserLocalValue(url, slug, lang, option, card)
}

async function getFundraiserLocalValue(url, slug, lang, option, card) {
  await fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      // console.log(data)
      setValues(data, slug, lang, option, card)
    })
}

function setValues(result, slug, lang, option, card) {
  fundraiserInfo = result['data']

  // Decide whether to show the tip_box or not
  var tipBox = document.getElementById('tip-box' + slug)
  if (!result.data.tip_enabled) {
    if (option === 2 || option === 4) {
      tipBox.style.display = 'none'
    } else {
      document.getElementById('modal-content' + slug).style.height = '700px'
      tipBox.style.display = 'none'
    }
  }

  if (option === 3 && card === 'hide') {
    var widgetContentDiv = document.getElementById(slug)
    widgetContentDiv.style.background = 'transparent'
    widgetContentDiv.style.boxShadow = 'none'
  }

  setModalId(result['data']['id'], slug)

  var fundraiserImageView = document.getElementById('fundraiser-image' + slug)

  if (fundraiserImageView) {
    fundraiserImageView.style.objectFit = 'cover'
    fundraiserImageView.src = result['data']['background']['image']
  }

  var targetAmount = document.getElementById('target-amount' + slug)
  var receiveAmount = document.getElementById('receive-amount' + slug)

  if (result['data']['show_donation_details']) {
    var progressDivCheck = document.getElementById('progress-bar' + slug)
    if (progressDivCheck) {
      progressDivCheck.style.visibility = 'visible'
    }

    receiveAmount.innerText = '€' + result['data']['donation']['amount']
    if (result['data']['amount_target'] > 0) {
      if (lang === 'nl') {
        targetAmount.innerText = 'van €' + result['data']['amount_target']
      } else if (lang === 'es') {
      } else if (lang === 'de') {
        targetAmount.innerText = 'von €' + result['data']['amount_target']
      } else {
        targetAmount.innerText = 'of €' + result['data']['amount_target']
      }
    }
    var date1 = new Date() // current date
    var date2 = new Date(result['data']['end_date']) // mm/dd/yyyy format
    var timeDiff = Math.abs(date2.getTime() - date1.getTime()) // in miliseconds
    var timeDiffInDays = Math.ceil(timeDiff / 1000 / 3600 / 24) // in second
    var remainDaysLabel = document.getElementById('remaining-days' + slug)

    if (timeDiffInDays <= 0 || result['data']['completed']) {
      if (lang === 'nl') {
        remainDaysLabel.innerText = 'Gesloten'
      } else if (lang === 'de') {
        remainDaysLabel.innerText = 'Geschlossen'
      } else if (lang === 'es') {
      } else {
        remainDaysLabel.innerText = 'Closed'
      }

      var donateBtn = document.getElementById('donate-btn+' + slug)
      donateBtn.disabled=true
      donateBtn.style.setProperty("background", "gray", "important")
    } else if (timeDiffInDays > 1000) {
      remainDaysLabel.innerText = ''
    } else {
      if (lang === 'nl') {
        remainDaysLabel.innerText = timeDiffInDays + ' dag(en)'
      } else if (lang === 'es') {
      } else if (lang === 'de') {
        remainDaysLabel.innerText =
          'immer noch ' + timeDiffInDays + ' verbleibende(r) Tag(e)'
      } else {
        remainDaysLabel.innerText = timeDiffInDays + ' day(s) left'
      }
    }

    if (result['data']['amount_target'] === 0) {
      var progressDiv = document.getElementById('progress-div' + slug)
      var progressBarScale = document.getElementById('progress-bar' + slug)
      progressDiv.style.display = 'none'
      progressBarScale.style.display = 'none'
    } else {
      var progressDiv = document.getElementById('progress-div' + slug)
      var progressBarScale = document.getElementById('progress-bar' + slug)
      progressDiv.style.display = 'flex'
      progressBarScale.style.display = 'flex'
      var progress = Number(
        (result['data']['donation']['amount'] /
          result['data']['amount_target']) *
          100
      ).toFixed(2)

      if (progress > 100) {
        progress = 100
        var raisedBar = document.getElementById('raised-bar' + slug)
        raisedBar.style.width = '100%'
      } else {
        raisedBar = document.getElementById('raised-bar' + slug)
        raisedBar.style.width = progress.toString() + '%'
      }

      var raisedLabel = document.getElementById('raised-label' + slug)
      if (lang === 'nl') {
        raisedLabel.innerText = progress + '% gefinancierd'
      } else if (lang === 'de') {
        raisedLabel.innerText = progress + '% finanziert'
      } else if (lang === 'es') {
      } else {
        raisedLabel.innerText = progress + '% funded'
      }
    }
  } else {
    var fundraiserInfoDiv = document.getElementById(
      'fundraiser-info-div' + slug
    )
    if (fundraiserInfoDiv) {
      var motherDiv=document.getElementById(slug)
      if (motherDiv.firstChild.id.includes('fundraiser-info-div')) {
        motherDiv.removeChild(motherDiv.firstChild)
      } else {
        motherDiv.removeChild(motherDiv.lastChild)
      }
      motherDiv.style.width = '400px'

      motherDiv.firstChild.style.width = '420px'
    }

    var progressDivCheck = document.getElementById('progress-bar' + slug)
    if (progressDivCheck) {
      progressDivCheck.style.visibility = 'hidden'
    }
  }

  // Start of ***************************  CUSTOM STYLING ****************************

  if (result['data']['custom_style']) {
    if (option === 2 || option === 4) {
      var donateBtnInForm = document.getElementById(
        'donate-btn-in-form+' + slug
      )
      donateBtnInForm.style.background =
        result['data']['custom_style']['secondary_color']

      donateBtnInForm.style.borderRadius =
        result['data']['custom_style']['button_radius'] + 'px'
    } else {
      var donateBtnInWidget = document.getElementById('donate-btn+' + slug)
      var donateBtnInModal = document.getElementById(
        'donate-btn-in-modal+' + slug
      )

      if (timeDiffInDays>0 && !result['data']['completed']) {    
        donateBtnInWidget.style.background =
          result['data']['custom_style']['secondary_color']
      }
      
      donateBtnInWidget.style.borderRadius =
        result['data']['custom_style']['button_radius'] + 'px'
      donateBtnInModal.style.background =
        result['data']['custom_style']['secondary_color']
      donateBtnInModal.style.borderRadius =
        result['data']['custom_style']['button_radius'] + 'px'
    }

    // Secure donation label color
    document.getElementById('secure-donation-label' + slug).style.color =
      result['data']['custom_style']['primary_color']

    // Design rest of the parts
    if (result['data']['tip_enabled']) {
      var tipbox = document.getElementById('tip-box' + slug)
      // console.log('actual color ', result['data']['custom_style']['secondary_color'])
      // console.log('lighten darken color ', lighten(result['data']['custom_style']['secondary_color'], 20))
      // tipbox.style.background = hexToRgb(
      //   result['data']['custom_style']['secondary_color'],
      // )
      tipBox.style.background =
        result['data']['custom_style']['secondary_color'] + '10'

      // tipBox.style.background=lighten(result['data']['custom_style']['secondary_color'], 20)
    }

    // Close button border
    var closeBtn = document.getElementById('close' + slug)
    if (closeBtn) {
      closeBtn.style.border =
        '2px solid ' + result['data']['custom_style']['secondary_color']
    }

    // For Selected Interval
    var oneTimeLabel = document.getElementById('onetime-label' + slug)
    var oneTimeRadio = document.getElementById('onetime' + slug)
    oneTimeLabel.onclick = () =>
      this.handlePeriodInterval(
        1,
        `perido-intervals-onetime+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )
    oneTimeRadio.onclick = () =>
      this.handlePeriodInterval(
        1,
        `perido-intervals-onetime+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )
    //Default select Onetime
    document.getElementById('onetime-bar' + slug).style.backgroundColor =
      result['data']['custom_style']['secondary_color']

    var monthlyLabel = document.getElementById('monthly-label' + slug)
    var monthlyRadio = document.getElementById('monthly' + slug)
    monthlyLabel.onclick = () =>
      this.handlePeriodInterval(
        2,
        `perido-intervals-monthly+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )
    monthlyRadio.onclick = () =>
      this.handlePeriodInterval(
        2,
        `perido-intervals-monthly+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )

    var yearlyLabel = document.getElementById('yearly-label' + slug)
    var yearlyRadio = document.getElementById('yearly' + slug)
    yearlyLabel.onclick = () =>
      this.handlePeriodInterval(
        3,
        `perido-intervals-yearly+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )
    yearlyRadio.onclick = () =>
      this.handlePeriodInterval(
        3,
        `perido-intervals-yearly+${slug}`,
        result['data']['custom_style']['secondary_color'],
        result['data']
      )

    // For Selected Amount
    var firstAmountLabel = document.getElementById('first-amount-label+' + slug)
    var secondAmountLabel = document.getElementById(
      'second-amount-label+' + slug
    )
    var thirdAmountLabel = document.getElementById('third-amount-label+' + slug)
    var forthAmountLabel = document.getElementById('forth-amount-label+' + slug)
    var otherAmountLabel = document.getElementById('other-amount-label+' + slug)

    document.getElementById('first-amount-div' + slug).style.backgroundColor =
      result['data']['custom_style']['primary_color']

    firstAmountLabel.onclick = () =>
      this.handleSelectAmount(
        'first',
        firstAmountLabel.id,
        result['data']['custom_style']['primary_color']
      )
    secondAmountLabel.onclick = () =>
      this.handleSelectAmount(
        'second',
        secondAmountLabel.id,
        result['data']['custom_style']['primary_color']
      )
    thirdAmountLabel.onclick = () =>
      this.handleSelectAmount(
        'third',
        thirdAmountLabel.id,
        result['data']['custom_style']['primary_color']
      )
    forthAmountLabel.onclick = () =>
      this.handleSelectAmount(
        'forth',
        forthAmountLabel.id,
        result['data']['custom_style']['primary_color']
      )
    otherAmountLabel.onclick = () =>
      this.handleSelectAmount(
        'other',
        otherAmountLabel.id,
        result['data']['custom_style']['primary_color']
      )
  }

  // END of ***************************  CUSTOM STYLING ****************************

  // Start of ***************************  CUSTOM AMOUNT ****************************
  // console.log('Fundriaser local data ', fundraiserInfo)
  if ('is_draft' in fundraiserInfo) {
    if (fundraiserInfo['is_draft']) {
      if (widgetDiv.dataset.lang=='nl') {
        window.alert('Url is al bezet.')
      } else if (widgetDiv.dataset.lang=='es') {
        window.alert('Url ya está tomada.')
      } else if (widgetDiv.dataset.lang=='de') {
        window.alert('Url ist bereits besetzt.')
      } else {
        window.alert('Url is already taken.')
      }
      return
    }
    else {
      customDonationConfiguration(fundraiserInfo, slug)
    }
  }
  
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function addLight(color, amount) {
  let cc = parseInt(color, 16) + amount
  let c = cc > 255 ? 255 : cc
  c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
  return c
}

function lighten(color, amount) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = parseInt((255 * amount) / 100)
  return (color = `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`)
}

function LightenDarkenColor(colorCode, amount) {
  var usePound = false

  if (colorCode[0] == '#') {
    colorCode = colorCode.slice(1)
    usePound = true
  }

  var num = parseInt(colorCode, 16)

  var r = (num >> 16) + amount

  if (r > 255) {
    r = 255
  } else if (r < 0) {
    r = 0
  }

  var b = ((num >> 8) & 0x00ff) + amount

  if (b > 255) {
    b = 255
  } else if (b < 0) {
    b = 0
  }

  var g = (num & 0x0000ff) + amount

  if (g > 255) {
    g = 255
  } else if (g < 0) {
    g = 0
  }

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

function adjust(color, amount) {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  )
}

function customDonationConfiguration(fundraiserInfo, slug) {
  let customDonationConfig = fundraiserInfo['custom_donation_configuration']
  if (
    Object.keys(customDonationConfig).length !== 0 &&
    customDonationConfig.constructor === Object
  ) {
    let count = 0
    let customDonationConfig = fundraiserInfo['custom_donation_configuration']
    if (!customDonationConfig['onetime_select']) {
      document.getElementById(
        'period-intervals-onetime+' + slug
      ).style.display = 'none'
      document.getElementById('onetime-bar' + slug).style.display = 'none'
      count += 1
    }
    if (!customDonationConfig['monthly_select']) {
      document.getElementById(
        'period-intervals-monthly+' + slug
      ).style.display = 'none'
      document.getElementById('monthly-bar' + slug).style.display = 'none'
      count += 1
    }
    if (!customDonationConfig['yearly_select']) {
      document.getElementById('period-intervals-yearly+' + slug).style.display =
        'none'
      document.getElementById('yearly-bar' + slug).style.display = 'none'
      count += 1
    }

    if (count < 3) {
      document.getElementById(
        'period-intervals-onetime+' + slug
      ).style.textAlign = 'center'
      document.getElementById(
        'period-intervals-monthly+' + slug
      ).style.textAlign = 'center'
      document.getElementById(
        'period-intervals-yearly+' + slug
      ).style.textAlign = 'center'
    }

    if (
      document.getElementById('period-intervals-onetime+' + slug).style
        .display == 'flex'
    ) {
      document.getElementById('onetime' + slug).checked = true
    } else if (
      document.getElementById('period-intervals-onetime+' + slug).style
        .display == 'flex'
    ) {
      document.getElementById('monthly' + slug).checked = true
    } else {
      document.getElementById('yearly' + slug).checked = true
    }

    var otherAmountDiv = document.getElementById(
      'other-amount-input-div+' + slug
    )
    // otherAmountDiv.style.visibility='hidden'
    var selectAmountDiv = document.getElementById(
      'select-amount-div-boxes' + slug
    )
    selectAmountDiv.style.display = 'flex'
    var tipBox = document.getElementById('tip-box' + slug)
    var amountErrMsg = document.getElementById(
      'missing-error-msg-amount' + slug
    )

    if (customDonationConfig['yearly_select']) {
      handlePeriodInterval(
        3,
        'period-intervals-yearly+' + slug,
        fundraiserInfo['custom_style']['secondary_color'],
        fundraiserInfo
      )

      if (customDonationConfig['yearly_style']) {
        document.getElementById('other-amount' + slug).checked = true
        otherAmountDiv.style.display = 'flex'
        // otherAmountDiv.style.visibility='visible'
        selectAmountDiv.style.display = 'none'
        renderOptionsForAmount(slug)
      } else {
        otherAmountDiv.style.display = 'none'
        amountErrMsg.style.display = 'none'
        document.getElementById('first-amount' + slug).checked = true
        document.getElementById('first-amount' + slug).value =
          customDonationConfig['yearly_first']
        document.getElementById('first-amount-label+' + slug).innerText =
          '€' + customDonationConfig['yearly_first']

        document.getElementById('second-amount' + slug).value =
          customDonationConfig['yearly_second']
        document.getElementById('second-amount-label+' + slug).innerText =
          '€' + customDonationConfig['yearly_second']

        document.getElementById('third-amount' + slug).value =
          customDonationConfig['yearly_third']
        document.getElementById('third-amount-label+' + slug).innerText =
          '€' + customDonationConfig['yearly_third']

        document.getElementById('forth-amount' + slug).value =
          customDonationConfig['yearly_forth']
        document.getElementById('forth-amount-label+' + slug).innerText =
          '€' + customDonationConfig['yearly_forth']
        renderOptionsForPercentile(slug)
      }
    }

    if (customDonationConfig['monthly_select']) {
      handlePeriodInterval(
        2,
        'period-intervals-monthly+' + slug,
        fundraiserInfo['custom_style']['secondary_color'],
        fundraiserInfo
      )

      if (customDonationConfig['monthly_style']) {
        document.getElementById('other-amount' + slug).checked = true
        otherAmountDiv.style.display = 'flex'
        // otherAmountDiv.style.visibility='visible'
        selectAmountDiv.style.display = 'none'
        renderOptionsForAmount(slug)
      } else {
        otherAmountDiv.style.display = 'none'
        amountErrMsg.style.display = 'none'
        document.getElementById('first-amount' + slug).checked = true
        document.getElementById('first-amount' + slug).value =
          customDonationConfig['monthly_first']
        document.getElementById('first-amount-label+' + slug).innerText =
          '€' + customDonationConfig['monthly_first']

        document.getElementById('second-amount' + slug).value =
          customDonationConfig['monthly_second']
        document.getElementById('second-amount-label+' + slug).innerText =
          '€' + customDonationConfig['monthly_second']

        document.getElementById('third-amount' + slug).value =
          customDonationConfig['monthly_third']
        document.getElementById('third-amount-label+' + slug).innerText =
          '€' + customDonationConfig['monthly_third']

        document.getElementById('forth-amount' + slug).value =
          customDonationConfig['monthly_forth']
        document.getElementById('forth-amount-label+' + slug).innerText =
          '€' + customDonationConfig['monthly_forth']
        renderOptionsForPercentile(slug)
      }
    }

    if (customDonationConfig['onetime_select']) {
      handlePeriodInterval(
        1,
        'period-intervals-onetime+' + slug,
        fundraiserInfo['custom_style']['secondary_color'],
        fundraiserInfo
      )

      if (customDonationConfig['onetime_style']) {
        document.getElementById('other-amount' + slug).checked = true
        otherAmountDiv.style.display = 'flex'
        // otherAmountDiv.style.visibility='visible'
        selectAmountDiv.style.display = 'none'
        renderOptionsForAmount(slug)
      } else {
        otherAmountDiv.style.display = 'none'
        amountErrMsg.style.display = 'none'
        document.getElementById('first-amount' + slug).checked = true
        document.getElementById('first-amount' + slug).value =
          customDonationConfig['onetime_first']
        document.getElementById('first-amount-label+' + slug).innerText =
          '€' + customDonationConfig['onetime_first']

        document.getElementById('second-amount' + slug).value =
          customDonationConfig['onetime_second']
        document.getElementById('second-amount-label+' + slug).innerText =
          '€' + customDonationConfig['onetime_second']

        document.getElementById('third-amount' + slug).value =
          customDonationConfig['onetime_third']
        document.getElementById('third-amount-label+' + slug).innerText =
          '€' + customDonationConfig['onetime_third']

        document.getElementById('forth-amount' + slug).value =
          customDonationConfig['onetime_forth']
        document.getElementById('forth-amount-label+' + slug).innerText =
          '€' + customDonationConfig['onetime_forth']
        renderOptionsForPercentile(slug)
      }
    }

    setDropdownFunc(tipBox, slug)
    handleTipDropdown(slug)
  }
}

function renderSelectAmount(fundraiserInfo, slug, payPeriod) {
  let customDonationConfig = fundraiserInfo['custom_donation_configuration']

  if (
    Object.keys(customDonationConfig).length !== 0 &&
    customDonationConfig.constructor === Object
  ) {
    var otherAmountDiv = document.getElementById(
      'other-amount-input-div+' + slug
    )
    otherAmountDiv.style.visibility = 'hidden'
    var selectAmountDiv = document.getElementById(
      'select-amount-div-boxes' + slug
    )
    selectAmountDiv.style.display = 'flex'
    var tipBox = document.getElementById('tip-box' + slug)

    document.getElementById('other-amount' + slug).checked = false
    document.getElementById('first-amount' + slug).checked = false

    document.getElementById('first-amount-div' + slug).style.backgroundColor =
      'white'
    document.getElementById('second-amount-div' + slug).style.backgroundColor =
      'white'
    document.getElementById('third-amount-div' + slug).style.backgroundColor =
      'white'
    document.getElementById('forth-amount-div' + slug).style.backgroundColor =
      'white'
    document.getElementById('other-amount-div' + slug).style.backgroundColor =
      'white'

    document.getElementById('first-amount-div' + slug).style.border =
      '1px solid black'
    document.getElementById('second-amount-div' + slug).style.border =
      '1px solid black'
    document.getElementById('third-amount-div' + slug).style.border =
      '1px solid black'
    document.getElementById('forth-amount-div' + slug).style.border =
      '1px solid black'
    document.getElementById('other-amount-div' + slug).style.border =
      '1px solid black'

    document.getElementById('first-amount-label+' + slug).style.color = 'black'
    document.getElementById('second-amount-label+' + slug).style.color = 'black'
    document.getElementById('third-amount-label+' + slug).style.color = 'black'
    document.getElementById('forth-amount-label+' + slug).style.color = 'black'
    document.getElementById('other-amount-label+' + slug).style.color = 'black'

    document.getElementById('other-amount-input' + slug).value = '€ '
    document.getElementById('missing-error-msg-amount' + slug).style.display =
      'none'

    if (customDonationConfig[payPeriod + '_select']) {
      if (customDonationConfig[payPeriod + '_style']) {
        document.getElementById('other-amount' + slug).checked = true
        otherAmountDiv.style.border = 'transparent'
        otherAmountDiv.style.display = 'flex'
        otherAmountDiv.style.visibility = 'visible'
        selectAmountDiv.style.display = 'none'
        renderOptionsForAmount(slug)
      } else {
        otherAmountDiv.style.display = 'none'
        otherAmountDiv.style.visibility = 'hidden'
        document.getElementById('first-amount' + slug).checked = true
        document.getElementById('first-amount-label+' + slug).style.color =
          'white'
        document.getElementById(
          'first-amount-div' + slug
        ).style.backgroundColor =
          fundraiserInfo['custom_style']['primary_color']
        document.getElementById('first-amount' + slug).value =
          customDonationConfig[payPeriod + '_first']
        document.getElementById('first-amount-label+' + slug).innerText =
          '€' + customDonationConfig[payPeriod + '_first']

        document.getElementById('second-amount' + slug).value =
          customDonationConfig[payPeriod + '_second']
        document.getElementById('second-amount-label+' + slug).innerText =
          '€' + customDonationConfig[payPeriod + '_second']

        document.getElementById('third-amount' + slug).value =
          customDonationConfig[payPeriod + '_third']
        document.getElementById('third-amount-label+' + slug).innerText =
          '€' + customDonationConfig[payPeriod + '_third']

        document.getElementById('forth-amount' + slug).value =
          customDonationConfig[payPeriod + '_forth']
        document.getElementById('forth-amount-label+' + slug).innerText =
          '€' + customDonationConfig[payPeriod + '_forth']
        renderOptionsForPercentile(slug)
      }
    }

    setDropdownFunc(tipBox, slug)
    calculateTotalAmount(slug)
  }
}

function designWidget(option) {
  if (option === 1) {
    var fundraiserImage = document.createElement('IMG')
    fundraiserImage.id = 'fundraiser-image' + widgetDiv.dataset.slug
    fundraiserImage.className = 'fundraiser-image'
    fundraiserImage.src =
      'https://res.cloudinary.com/dxhaja5tz/image/upload/v1585584744/35_gdepw8.gif'
    fundraiserImage.style.height = '150px'
    fundraiserImage.style.width = '100%'
    fundraiserImage.style.marginBottom = '10px'
    fundraiserImage.style.borderTopLeftRadius = '15px'
    fundraiserImage.style.borderTopRightRadius = '15px'
    widgetDiv.style.height = '350px'
    // var blankDiv = document.createElement('DIV')
    // blankDiv.style.width = '100%'
    widgetDiv.appendChild(fundraiserImage)
    // widgetDiv.appendChild(blankDiv)

    var amountInfoDiv = document.createElement('div')
    amountInfoDiv.id = 'amount-info-div-only-image' + widgetDiv.dataset.slug
    amountInfoDiv.className = 'amount-info-div-only-image'
    widgetDiv.appendChild(amountInfoDiv)

    var receiveAmount = document.createElement('LABEL')
    receiveAmount.id = 'receive-amount' + widgetDiv.dataset.slug
    receiveAmount.className = 'receive-amount'
    amountInfoDiv.appendChild(receiveAmount)

    var targetAmount = document.createElement('LABEL')
    targetAmount.id = 'target-amount' + widgetDiv.dataset.slug
    targetAmount.className = 'target-amount'
    amountInfoDiv.appendChild(targetAmount)

    var progressBar = document.createElement('DIV')
    progressBar.className = 'progress-bar'
    progressBar.id = 'progress-bar' + widgetDiv.dataset.slug
    widgetDiv.appendChild(progressBar)

    var raisedBar = document.createElement('DIV')
    raisedBar.id = 'raised-bar' + widgetDiv.dataset.slug
    raisedBar.className = 'raised-bar'
    progressBar.appendChild(raisedBar)

    var progressDiv = document.createElement('DIV')
    progressDiv.id = 'progress-div' + widgetDiv.dataset.slug
    progressDiv.className = 'progress-div'
    widgetDiv.appendChild(progressDiv)

    var raisedLabel = document.createElement('LABEL')
    raisedLabel.id = 'raised-label' + widgetDiv.dataset.slug
    raisedLabel.className = 'raised-label'
    progressDiv.appendChild(raisedLabel)

    var daysLabel = document.createElement('LABEL')
    daysLabel.id = 'remaining-days' + widgetDiv.dataset.slug
    daysLabel.className = 'remaining-days'
    progressDiv.appendChild(daysLabel)

    // donateButton.id = 'donate-btn+' + widgetDiv.dataset.slug
    // donateButton.className = 'donate-btn'
    // donateButton.innerHTML = 'Donate'
    // donateButton.onclick = () => this.handleDonate(donateButton.id)
    // widgetDiv.appendChild(donateButton)

    var donateBtnDiv = document.createElement('div')
    donateBtnDiv.id = 'donate-btn-div+' + widgetDiv.dataset.slug
    donateButton.id = 'donate-btn+' + widgetDiv.dataset.slug
    donateButton.className = 'donate-btn'
    if (widgetDiv.dataset.lang === 'nl') {
      donateButton.innerHTML = '<i class="fa"></i> Doneer'
    } else if (widgetDiv.dataset.lang === 'de') {
      donateButton.innerHTML = '<i class="fa"></i> Spenden'
    } else if (widgetDiv.dataset.lang === 'es') {
      modalDonateButton.innerHTML = '<i class="fa"></i> Donar'
    } else {
      donateButton.innerHTML = '<i class="fa"></i> Donate'
    }
    donateButton.onclick = () => this.handleDonate(donateBtnDiv.id)
    donateBtnDiv.appendChild(donateButton)
    widgetDiv.appendChild(donateBtnDiv)
  } else if (option === 2) {
    //create left side
    var donationForm = document.createElement('DIV')
    donationForm.id = 'donation-form' + widgetDiv.dataset.slug
    donationForm.className = 'donation-form'
    donationForm.style.height = '100%'
    donationForm.style.width = '50%'
    donationForm.style.margin = '10px'
    // donationForm.style.backgroundColor = 'red'
    widgetDiv.className = 'widget-with-form'
    widgetDiv.style.backgroundColor = 'white'
    // widgetDiv.style.height = '350px !important'
    widgetDiv.appendChild(donationForm)

    widgetDiv.style.display = 'flex'
    widgetDiv.style.flexDirection = 'row'
    widgetDiv.style.width = '800px'

    var labelDiv = document.createElement('div')
    labelDiv.id = 'block-div' + widgetDiv.dataset.slug
    labelDiv.className = 'block-div'
    // labelDiv.style.display = 'flex'
    // labelDiv.style.flexDirection = 'column'
    donationForm.appendChild(labelDiv)

    var fundraiserIdLabel = document.createElement('label')
    fundraiserIdLabel.id = 'fundraiser-id-label' + widgetDiv.dataset.slug
    fundraiserIdLabel.style.display = 'none'
    fundraiserIdLabel.style.float = 'left'
    labelDiv.appendChild(fundraiserIdLabel)

    var label1 = document.createElement('label')
    label1.id = 'secure-donation-label' + widgetDiv.dataset.slug
    label1.className = 'secure-donation-label'
    if (widgetDiv.dataset.lang === 'nl') {
      label1.innerText = 'Veilig online doneren'
    } else if (widgetDiv.dataset.lang === 'de') {
      label1.innerText = 'Gesicherte Online-Spende'
    } else if (widgetDiv.dataset.lang === 'es') {
      label1.innerText = 'Donación en línea segura'
    } else {
      label1.innerText = 'Secured Online Donation'
    }

    labelDiv.appendChild(label1)

    var label2 = document.createElement('label')
    label2.id = 'label2' + widgetDiv.dataset.slug
    label2.className = 'label2'
    if (widgetDiv.dataset.lang === 'nl') {
      label2.innerText = 'Voer je donatie in'
    } else if (widgetDiv.dataset.lang === 'de') {
      label2.innerText = 'Geben Sie Ihre Spende ein'
    } else if (widgetDiv.dataset.lang === 'es') {
      label2.innerText = 'Ingrese su donación'
    } else {
      label2.innerText = 'Enter your donation'
    }
    labelDiv.appendChild(label2)

    // ----------- period inervals -------------------

    var periodDiv = document.createElement('div')
    periodDiv.id = 'period-intervals' + widgetDiv.dataset.slug
    periodDiv.className = 'period-intervals'
    donationForm.appendChild(periodDiv)

    var periodOnetimeDiv = document.createElement('div')
    periodOnetimeDiv.id = 'period-intervals-onetime+' + widgetDiv.dataset.slug
    periodOnetimeDiv.className = 'period-intervals-onetime'

    var oneTimeLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      oneTimeLabel.innerText = 'Eenmalig'
    } else if (widgetDiv.dataset.lang === 'de') {
      oneTimeLabel.innerText = 'Einmalig'
    } else if (widgetDiv.dataset.lang === 'es') {
      oneTimeLabel.innerText = 'Una Vez'
    } else {
      oneTimeLabel.innerText = 'One time'
    }
    oneTimeLabel.id = 'onetime-label' + widgetDiv.dataset.slug
    oneTimeLabel.fontSize = '14px'
    oneTimeLabel.style.display = 'block'
    oneTimeLabel.style.width = '100%'
    oneTimeLabel.onclick = () =>
      this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

    var oneTimeRadio = document.createElement('input')
    oneTimeRadio.setAttribute('type', 'radio')
    oneTimeRadio.id = 'onetime' + widgetDiv.dataset.slug
    oneTimeRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    oneTimeRadio.value = '1'
    oneTimeRadio.checked = true
    oneTimeRadio.onclick = () =>
      this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

    periodOnetimeDiv.appendChild(oneTimeRadio)
    periodOnetimeDiv.appendChild(oneTimeLabel)
    periodDiv.appendChild(periodOnetimeDiv)

    var periodMonthlyDiv = document.createElement('div')
    periodMonthlyDiv.id = 'period-intervals-monthly+' + widgetDiv.dataset.slug
    periodMonthlyDiv.className = 'period-intervals-monthly'

    var monthlyLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      monthlyLabel.innerText = 'Maandelijks'
    } else if (widgetDiv.dataset.lang === 'de') {
      monthlyLabel.innerText = 'Monatlich'
    } else if (widgetDiv.dataset.lang === 'es') {
      monthlyLabel.innerText = 'Mensualmente'
    } else {
      monthlyLabel.innerText = 'Monthly'
    }
    monthlyLabel.id = 'monthly-label' + widgetDiv.dataset.slug
    monthlyLabel.fontSize = '14px'
    monthlyLabel.style.display = 'block'
    monthlyLabel.style.width = '100%'
    monthlyLabel.onclick = () =>
      this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

    var monthlyRadio = document.createElement('input')
    monthlyRadio.setAttribute('type', 'radio')
    monthlyRadio.id = 'monthly' + widgetDiv.dataset.slug
    monthlyRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    monthlyRadio.value = '2'
    monthlyRadio.onclick = () =>
      this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

    periodMonthlyDiv.appendChild(monthlyRadio)
    periodMonthlyDiv.appendChild(monthlyLabel)
    periodDiv.appendChild(periodMonthlyDiv)

    var periodYearlyDiv = document.createElement('div')
    periodYearlyDiv.id = 'period-intervals-yearly+' + widgetDiv.dataset.slug
    periodYearlyDiv.className = 'period-intervals-yearly'

    var yearlyLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      yearlyLabel.innerText = 'Jaarlijks'
    } else if (widgetDiv.dataset.lang === 'de') {
      yearlyLabel.innerText = 'Jährlich'
    } else if (widgetDiv.dataset.lang === 'es') {
      yearlyLabel.innerText = 'Anualmente'
    } else {
      yearlyLabel.innerText = 'Yearly'
    }
    yearlyLabel.id = 'yearly-label' + widgetDiv.dataset.slug
    yearlyLabel.fontSize = '14px'
    yearlyLabel.style.display = 'block'
    yearlyLabel.style.width = '100%'
    yearlyLabel.onclick = () =>
      this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

    var yearlyRadio = document.createElement('input')
    yearlyRadio.setAttribute('type', 'radio')
    yearlyRadio.id = 'yearly' + widgetDiv.dataset.slug
    yearlyRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    yearlyRadio.value = '3'
    yearlyRadio.onclick = () =>
      this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

    periodYearlyDiv.appendChild(yearlyRadio)
    periodYearlyDiv.appendChild(yearlyLabel)
    periodDiv.appendChild(periodYearlyDiv)

    // ----------- period inervals -------------------

    var hrule = document.createElement('hr')
    hrule.style.background = '#E8E8E8'
    hrule.style.height = '2px'
    hrule.style.display = 'flex'
    hrule.style.flexDirection = 'row'
    hrule.style.justifyContent = 'space-between'
    hrule.style.border = 'transparent'
    donationForm.appendChild(hrule)

    var oneTimeBar = document.createElement('div')
    oneTimeBar.id = 'onetime-bar' + widgetDiv.dataset.slug
    oneTimeBar.className = 'onetime-bar'
    oneTimeBar.style.height = '2px'
    oneTimeBar.style.width = '100%'
    oneTimeBar.style.background = '#112FEB'
    hrule.appendChild(oneTimeBar)

    var monthlyBar = document.createElement('div')
    monthlyBar.id = 'monthly-bar' + widgetDiv.dataset.slug
    monthlyBar.className = 'monthly-bar'
    monthlyBar.style.height = '2px'
    monthlyBar.style.width = '100%'
    monthlyBar.style.background = '#E8E8E8'
    hrule.appendChild(monthlyBar)

    var yearlyBar = document.createElement('div')
    yearlyBar.id = 'yearly-bar' + widgetDiv.dataset.slug
    yearlyBar.className = 'yearly-bar'
    yearlyBar.style.height = '2px'
    yearlyBar.style.width = '100%'
    yearlyBar.style.background = '#E8E8E8'
    hrule.appendChild(yearlyBar)

    var selectAmountLabelDiv = document.createElement('div')
    selectAmountLabelDiv.id = 'select-amount-div' + widgetDiv.dataset.slug
    selectAmountLabelDiv.className = 'select-amount-div'

    var selectAmountlabel = document.createElement('label')
    selectAmountlabel.id = 'select-amount-label' + widgetDiv.dataset.slug
    selectAmountlabel.className = 'select-amount-label'
    if (widgetDiv.dataset.lang === 'nl') {
      selectAmountlabel.innerText = 'Anders'
    } else if (widgetDiv.dataset.lang === 'de') {
      selectAmountlabel.innerText = 'Betrag'
    } else if (widgetDiv.dataset.lang === 'es') {
    } else {
      selectAmountlabel.innerText = 'Amount'
    }
    selectAmountlabel.style.fontSize = '16px'
    selectAmountlabel.fontWeight = '700'
    selectAmountLabelDiv.appendChild(selectAmountlabel)
    donationForm.appendChild(selectAmountLabelDiv)

    // ----------- copied from here -----------------------

    var amountDiv = document.createElement('div')
    amountDiv.id = 'select-amount-div-boxes' + widgetDiv.dataset.slug
    amountDiv.className = 'select-amount-div-boxes'
    amountDiv.style.display = 'flex'
    amountDiv.style.marginTop = '10px'
    amountDiv.style.flexDirection = 'row'
    amountDiv.style.justifyContent = 'space-around'
    donationForm.appendChild(amountDiv)

    var firstAmount = document.createElement('div')
    firstAmount.id = 'first-amount-div' + widgetDiv.dataset.slug
    firstAmount.className = 'first-amount-div'
    // firstAmount.style.display = 'flex'
    // firstAmount.style.flexDirection = 'row'
    // firstAmount.style.height = '45px'
    // firstAmount.style.width = '60px'
    // firstAmount.style.borderRadius = '5px'
    // firstAmount.style.border = '1px black solid'
    // firstAmount.style.backgroundColor = '#2828d6'
    firstAmount.style.color = 'white'

    var firstAmountRadio = document.createElement('input')
    firstAmountRadio.setAttribute('type', 'radio')
    firstAmountRadio.id = 'first-amount' + widgetDiv.dataset.slug
    firstAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    firstAmountRadio.value = '25'
    firstAmountRadio.style.marginTop = '15px'
    firstAmountRadio.checked = true

    var firstAmountLabel = document.createElement('label')
    firstAmountLabel.id = 'first-amount-label+' + widgetDiv.dataset.slug
    firstAmountLabel.className = 'first-amount-label'
    firstAmountLabel.innerText = '€25'
    firstAmountLabel.style.fontSize = '16px'
    firstAmountLabel.style.fontWeight = '700'
    firstAmountLabel.style.marginTop = '12px'
    firstAmountLabel.style.display = 'block'
    firstAmountLabel.onclick = () =>
      this.handleSelectAmount('first', firstAmountLabel.id, '')

    firstAmount.appendChild(firstAmountRadio)
    firstAmount.appendChild(firstAmountLabel)

    amountDiv.appendChild(firstAmount)

    var secondAmount = document.createElement('div')
    secondAmount.id = 'second-amount-div' + widgetDiv.dataset.slug
    secondAmount.className = 'second-amount-div'
    // secondAmount.style.height = '45px'
    // secondAmount.style.width = '60px'
    // secondAmount.style.borderRadius = '5px'
    // secondAmount.style.border = '1px black solid'
    // secondAmount.style.display = 'flex'
    // secondAmount.style.flexDirection = 'row'

    var secondAmountRadio = document.createElement('input')
    secondAmountRadio.setAttribute('type', 'radio')
    secondAmountRadio.id = 'second-amount' + widgetDiv.dataset.slug
    secondAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    secondAmountRadio.value = '50'
    secondAmountRadio.style.marginTop = '15px'

    var secondAmountLabel = document.createElement('label')
    secondAmountLabel.id = 'second-amount-label+' + widgetDiv.dataset.slug
    secondAmountLabel.className = 'second-amount-label'
    secondAmountLabel.innerText = '€50'
    secondAmountLabel.style.fontSize = '16px'
    secondAmountLabel.style.fontWeight = '700'
    secondAmountLabel.style.marginTop = '12px'
    secondAmountLabel.style.display = 'block'
    secondAmountLabel.onclick = () =>
      this.handleSelectAmount('second', secondAmountLabel.id, '')

    secondAmount.appendChild(secondAmountRadio)
    secondAmount.appendChild(secondAmountLabel)

    amountDiv.appendChild(secondAmount)

    var thirdAmount = document.createElement('div')
    thirdAmount.id = 'third-amount-div' + widgetDiv.dataset.slug
    thirdAmount.className = 'third-amount-div'
    // thirdAmount.style.height = '45px'
    // thirdAmount.style.width = '60px'
    // thirdAmount.style.borderRadius = '5px'
    // thirdAmount.style.border = '1px black solid'
    // thirdAmount.style.display = 'flex'
    // thirdAmount.style.flexDirection = 'row'

    var thirdAmountRadio = document.createElement('input')
    thirdAmountRadio.setAttribute('type', 'radio')
    thirdAmountRadio.id = 'third-amount' + widgetDiv.dataset.slug
    thirdAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    thirdAmountRadio.value = '75'
    thirdAmountRadio.style.marginTop = '15px'

    var thirdAmountLable = document.createElement('label')
    thirdAmountLable.id = 'third-amount-label+' + widgetDiv.dataset.slug
    thirdAmountLable.className = 'third-amount-label'
    thirdAmountLable.innerText = '€75'
    thirdAmountLable.style.fontSize = '16px'
    thirdAmountLable.style.fontWeight = '700'
    thirdAmountLable.style.marginTop = '12px'
    thirdAmountLable.style.display = 'block'
    thirdAmountLable.onclick = () =>
      this.handleSelectAmount('third', thirdAmountLable.id, '')

    thirdAmount.appendChild(thirdAmountRadio)
    thirdAmount.appendChild(thirdAmountLable)

    amountDiv.appendChild(thirdAmount)

    var forthAmount = document.createElement('div')
    forthAmount.id = 'forth-amount-div' + widgetDiv.dataset.slug
    forthAmount.className = 'forth-amount-div'
    // forthAmount.style.height = '45px'
    // forthAmount.style.width = '60px'
    // forthAmount.style.borderRadius = '5px'
    // forthAmount.style.border = '1px black solid'
    // forthAmount.style.display = 'flex'
    // forthAmount.style.flexDirection = 'row'

    var forthAmountRadio = document.createElement('input')
    forthAmountRadio.setAttribute('type', 'radio')
    forthAmountRadio.id = 'forth-amount' + widgetDiv.dataset.slug
    forthAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    forthAmountRadio.value = '100'
    forthAmountRadio.style.marginTop = '15px'

    var forthAmountLabel = document.createElement('label')
    forthAmountLabel.id = 'forth-amount-label+' + widgetDiv.dataset.slug
    forthAmountLabel.className = 'forth-amount-label'
    forthAmountLabel.innerText = '€100'
    forthAmountLabel.style.fontSize = '16px'
    forthAmountLabel.style.fontWeight = '700'
    forthAmountLabel.style.marginTop = '12px'
    forthAmountLabel.style.display = 'block'
    forthAmountLabel.onclick = () =>
      this.handleSelectAmount('forth', forthAmountLabel.id, '')

    forthAmount.appendChild(forthAmountRadio)
    forthAmount.appendChild(forthAmountLabel)

    amountDiv.appendChild(forthAmount)

    var otherAmount = document.createElement('div')
    otherAmount.id = 'other-amount-div' + widgetDiv.dataset.slug
    otherAmount.className = 'other-amount-div'
    // otherAmount.style.height = '45px'
    // otherAmount.style.width = '60px'
    // otherAmount.style.borderRadius = '5px'
    // otherAmount.style.border = '1px black solid'
    // otherAmount.style.display = 'flex'
    // otherAmount.style.flexDirection = 'row'

    var otherAmountRadio = document.createElement('input')
    otherAmountRadio.setAttribute('type', 'radio')
    otherAmountRadio.id = 'other-amount' + widgetDiv.dataset.slug
    otherAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    otherAmountRadio.value = 'other'
    otherAmountRadio.style.marginTop = '15px'

    var otherAmountLabel = document.createElement('label')
    otherAmountLabel.id = 'other-amount-label+' + widgetDiv.dataset.slug
    otherAmountLabel.className = 'other-amount-label'
    if (widgetDiv.dataset.lang === 'nl') {
      otherAmountLabel.innerText = 'Bedrag'
    } else if (widgetDiv.dataset.lang === 'de') {
      otherAmountLabel.innerText = 'Andere'
    } else if (widgetDiv.dataset.lang === 'es') {
      otherAmountLabel.innerText = 'Cantidad'
    } else {
      otherAmountLabel.innerText = 'Other'
    }
    otherAmountLabel.style.fontSize = '16px'
    otherAmountLabel.style.fontWeight = '700'
    otherAmountLabel.style.marginTop = '12px'
    otherAmountLabel.style.display = 'block'
    otherAmountLabel.onclick = () =>
      this.handleSelectAmount('other', otherAmountLabel.id, '')
    otherAmount.appendChild(otherAmountRadio)
    otherAmount.appendChild(otherAmountLabel)

    amountDiv.appendChild(otherAmount)

    var otherAmountInputDiv = document.createElement('div')
    otherAmountInputDiv.id = 'other-amount-input-div+' + widgetDiv.dataset.slug
    otherAmountInputDiv.className = 'other-amount-input-div'

    var otherAmountInput = document.createElement('input')
    otherAmount.setAttribute('type', 'number')
    if (widgetDiv.dataset.lang === 'nl') {
      otherAmountInput.placeholder = 'Ander bedrag'
    } else if (widgetDiv.dataset.lang === 'de') {
      otherAmountInput.placeholder = 'Anderer betrag'
    } else if (widgetDiv.dataset.lang === 'es') {
      otherAmountInput.placeholder = 'Otra cantidad'
    } else {
      otherAmountInput.placeholder = 'Other amount'
    }
    otherAmountInput.id = 'other-amount-input' + widgetDiv.dataset.slug
    otherAmountInput.value = '€ '
    otherAmountInput.onkeyup = (e) =>
      this.handleOtherAmountInput(e.target.value, otherAmountInput.id)

    otherAmountInputDiv.appendChild(otherAmountInput)
    donationForm.appendChild(otherAmountInputDiv)

    var missingAmountMsg = document.createElement('p')
    missingAmountMsg.id = 'missing-error-msg-amount' + widgetDiv.dataset.slug
    missingAmountMsg.className = 'missing-error-msg-amount'
    if (widgetDiv.dataset.lang === 'nl') {
      missingAmountMsg.innerText = 'Minimaal €5,-'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingAmountMsg.innerText = 'Mindestens €5,-'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingAmountMsg.innerText = 'Mínimo de €5,-'
    } else {
      missingAmountMsg.innerText = 'Minimum €5,-'
    }
    donationForm.appendChild(missingAmountMsg)

    var donorInfoDiv = document.createElement('div')
    donorInfoDiv.id = 'donor-info-div' + widgetDiv.dataset.slug
    donorInfoDiv.className = 'donor-info-div'
    donationForm.appendChild(donorInfoDiv)

    var firstNameInput = document.createElement('input')
    firstNameInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      firstNameInput.placeholder = 'Voornaam'
    } else if (widgetDiv.dataset.lang === 'de') {
      firstNameInput.placeholder = 'Voornaam'
    } else if (widgetDiv.dataset.lang === 'es') {
      firstNameInput.placeholder = 'Nombre'
    } else {
      firstNameInput.placeholder = 'First name'
    }
    firstNameInput.id = 'first-name-field' + widgetDiv.dataset.slug
    firstNameInput.className = 'first-name-field'
    donorInfoDiv.appendChild(firstNameInput)

    var missingFirstNametMsg = document.createElement('p')
    missingFirstNametMsg.id =
      'missing-error-msg-first-name' + widgetDiv.dataset.slug
    missingFirstNametMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingFirstNametMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingFirstNametMsg.innerText =
        'Muss zwischen 1 und 30 Zeichen lang sein.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingFirstNametMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
    } else {
      missingFirstNametMsg.innerText = 'Must be between 1 and 30 characters.'
    }
    donorInfoDiv.appendChild(missingFirstNametMsg)

    var lastNameInput = document.createElement('input')
    lastNameInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      lastNameInput.placeholder = 'Achternaam'
    } else if (widgetDiv.dataset.lang === 'de') {
      lastNameInput.placeholder = 'Nachname'
    } else if (widgetDiv.dataset.lang === 'es') {
      lastNameInput.placeholder = 'Apellido'
    } else {
      lastNameInput.placeholder = 'Last name'
    }
    lastNameInput.id = 'last-name-field' + widgetDiv.dataset.slug
    lastNameInput.className = 'last-name-field'
    donorInfoDiv.appendChild(lastNameInput)

    var missingLastNameMsg = document.createElement('p')
    missingLastNameMsg.id =
      'missing-error-msg-last-name' + widgetDiv.dataset.slug
    missingLastNameMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingLastNameMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingLastNameMsg.innerText = 'Muss zwischen 1 und 30 Zeichen lang sein.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingLastNameMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
    } else {
      missingLastNameMsg.innerText = 'Must be between 1 and 30 characters.'
    }
    donorInfoDiv.appendChild(missingLastNameMsg)

    var emailInput = document.createElement('input')
    emailInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      emailInput.placeholder = 'Emailadres'
    } else if (widgetDiv.dataset.lang === 'de') {
      emailInput.placeholder = 'E-Mail-Adresse'
    } else if (widgetDiv.dataset.lang === 'es') {
      emailInput.placeholder = 'Dirección de email'
    } else {
      emailInput.placeholder = 'Email'
    }
    emailInput.id = 'email-field' + widgetDiv.dataset.slug
    emailInput.className = 'email-field'
    donorInfoDiv.appendChild(emailInput)

    var missingEmailMsg = document.createElement('p')
    missingEmailMsg.id = 'missing-error-msg-email' + widgetDiv.dataset.slug
    missingEmailMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingEmailMsg.innerText = 'Onjuist emailadres.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingEmailMsg.innerText = 'Falsche E-Mail-Adresse.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingEmailMsg.innerText = 'Dirección de E-Mail incorrecta.'
    } else {
      missingEmailMsg.innerText = 'Incorrect email address.'
    }
    donorInfoDiv.appendChild(missingEmailMsg)

    createTipbox(
      donationForm,
      null,
      widgetDiv.dataset.slug,
      '',
      widgetDiv.dataset.lang
    )
    calculateTotalAmount(widgetDiv.dataset.slug)

    // ----------- copied from here -----------------------

    // donateButton.id = 'donate-btn-in-form+' + widgetDiv.dataset.slug
    // donateButton.className = 'donate-btn-in-form'
    // donateButton.innerHTML = 'Donate'
    // donateButton.onclick = () => this.directDonate(donateButton.id)
    // donationForm.appendChild(donateButton)

    var anonymousDiv=addAnonymousBox(widgetDiv.dataset.slug, widgetDiv.dataset.lang)
    donationForm.appendChild(anonymousDiv)

    donateBtnDiv = document.createElement('div')
    donateBtnDiv.id = 'donate-btn-in-form-div+' + widgetDiv.dataset.slug
    donateButton.id = 'donate-btn-in-form+' + widgetDiv.dataset.slug
    donateButton.className = 'donate-btn-in-form'
    if (widgetDiv.dataset.lang === 'nl') {
      donateButton.innerHTML = '<i class="fa"></i> Doneer'
    } else if (widgetDiv.dataset.lang === 'de') {
      donateButton.innerHTML = '<i class="fa"></i> Spenden'
    } else if (widgetDiv.dataset.lang === 'es') {
      donateButton.innerHTML = '<i class="fa"></i> Donar'
    } else {
      donateButton.innerHTML = '<i class="fa"></i> Donate'
    }
    donateButton.onclick = () =>
      this.directDonate(donateBtnDiv.id, widgetDiv.dataset.lang)
    donateBtnDiv.appendChild(donateButton)
    donationForm.appendChild(donateBtnDiv)

    var poweredByDiv = document.createElement('div')
    poweredByDiv.id = 'powered-by-div+' + widgetDiv.dataset.slug
    poweredByDiv.className = 'powered-by-div'
    donationForm.appendChild(poweredByDiv)

    var poweredByLabel = document.createElement('label')
    poweredByLabel.id = 'powered-by-label+' + widgetDiv.dataset.slug
    poweredByLabel.className = 'powered-by-label'
    if (widgetDiv.dataset.lang === 'nl') {
      poweredByLabel.textContent = 'Ondersteund door '
    } else if (widgetDiv.dataset.lang === 'de') {
      poweredByLabel.textContent = 'Angetrieben von '
    } else if (widgetDiv.dataset.lang === 'es') {
    } else {
      poweredByLabel.textContent = 'Powered by '
    }
    poweredByDiv.appendChild(poweredByLabel)

    var whydonateLogo = document.createElement('img')
    whydonateLogo.id = 'whydonate-logo+' + widgetDiv.dataset.slug
    whydonateLogo.className = 'whydonate-logo'
    whydonateLogo.src =
      'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/whydonate-logo-licht.webp'
    if (widgetDiv.dataset.lang === 'nl') {
      whydonateLogo.onclick = () => {
        window.location.href = 'https://www.whydonate.nl/'
      }
    } else {
      whydonateLogo.onclick = () => {
        window.location.href = 'https://www.whydonate.eu/'
      }
    }
    poweredByDiv.appendChild(whydonateLogo)

    // create right side
    var fundraiserInfoDiv = document.createElement('DIV')
    fundraiserInfoDiv.id = 'fundraiser-info-div' + widgetDiv.dataset.slug
    fundraiserInfoDiv.className = 'fundraiser-info-div'

    fundraiserInfoDiv.style.height = '100%'
    fundraiserInfoDiv.style.width = '50%'
    fundraiserInfoDiv.style.backgroundColor = 'rgb(248, 245, 245)'
    fundraiserInfoDiv.style.borderRadius = '10px'

    widgetDiv.appendChild(fundraiserInfoDiv)

    fundraiserImage = document.createElement('IMG')
    fundraiserImage.id = 'fundraiser-image' + widgetDiv.dataset.slug
    fundraiserImage.className = 'fundraiser-image'
    fundraiserImage.src =
      'https://res.cloudinary.com/dxhaja5tz/image/upload/v1585584744/35_gdepw8.gif'
    fundraiserImage.style.height = '150px'
    fundraiserImage.style.width = '100%'
    fundraiserImage.style.objectFit = 'scale-down'
    fundraiserImage.style.marginBottom = '10px'
    fundraiserImage.style.borderTopLeftRadius = '15px'
    fundraiserImage.style.borderTopRightRadius = '15px'
    widgetDiv.style.height = '350px'

    setTimeout(50000)

    // var blankDiv = document.createElement('DIV')
    // blankDiv.id = 'blank-div'
    // blankDiv.style.width = '100%'
    fundraiserInfoDiv.appendChild(fundraiserImage)
    // fundraiserInfoDiv.appendChild(blankDiv)

    var amountInfoDiv = document.createElement('div')
    amountInfoDiv.id = 'amount-info-div' + widgetDiv.dataset.slug
    amountInfoDiv.className = 'amount-info-div'

    var receiveAmount = document.createElement('LABEL')
    receiveAmount.id = 'receive-amount' + widgetDiv.dataset.slug
    receiveAmount.className = 'receive-amount'
    amountInfoDiv.appendChild(receiveAmount)
    // fundraiserInfoDiv.appendChild(receiveAmount)

    var targetAmount = document.createElement('LABEL')
    targetAmount.id = 'target-amount' + widgetDiv.dataset.slug
    targetAmount.className = 'target-amount'
    amountInfoDiv.appendChild(targetAmount)
    // fundraiserInfoDiv.appendChild(targetAmount)

    fundraiserInfoDiv.appendChild(amountInfoDiv)

    var progressBarDiv = document.createElement('div')
    progressBarDiv.id = 'progress-bar-div' + widgetDiv.dataset.slug
    progressBarDiv.className = 'progress-bar-div'

    var progressBar = document.createElement('DIV')
    progressBar.id = 'progress-bar' + widgetDiv.dataset.slug
    progressBar.className = 'progress-bar'
    progressBarDiv.appendChild(progressBar)
    fundraiserInfoDiv.appendChild(progressBarDiv)

    var raisedBar = document.createElement('DIV')
    raisedBar.id = 'raised-bar' + widgetDiv.dataset.slug
    raisedBar.className = 'raised-bar'
    progressBar.appendChild(raisedBar)

    var progressFormDiv = document.createElement('div')
    progressFormDiv.id = 'progress-form-div' + widgetDiv.dataset.slug
    progressFormDiv.className = 'progress-form-div'

    progressDiv = document.createElement('DIV')
    progressDiv.id = 'progress-div' + widgetDiv.dataset.slug
    progressDiv.className = 'progress-div'

    progressFormDiv.appendChild(progressDiv)
    fundraiserInfoDiv.appendChild(progressFormDiv)

    var raisedLabel = document.createElement('LABEL')
    raisedLabel.id = 'raised-label' + widgetDiv.dataset.slug
    raisedLabel.className = 'raised-label'
    progressDiv.appendChild(raisedLabel)

    var daysLabel = document.createElement('LABEL')
    daysLabel.id = 'remaining-days' + widgetDiv.dataset.slug
    daysLabel.className = 'remaining-days'
    progressDiv.appendChild(daysLabel)

    var rightSideRule = document.createElement('div')
    rightSideRule.id = 'right-side-rule' + widgetDiv.dataset.slug
    rightSideRule.className = 'right-side-rule'
    progressFormDiv.appendChild(rightSideRule)
    fundraiserInfoDiv.appendChild(progressFormDiv)

    // donateButton.id = 'donate-btn'
    // donateButton.innerHTML = 'Donate'
    // donateButton.onclick = this.handleDonate()
    // fundraiserInfoDiv.appendChild(donateButton)

    // widgetDiv.appendChild(fundraiserImage)
    // widgetDiv.appendChild(blankDiv)
  } else if (option === 4) {
    //create left side
    var donationForm = document.createElement('DIV')
    donationForm.id = 'donation-form' + widgetDiv.dataset.slug
    donationForm.className = 'donation-form'
    donationForm.style.height = '100%'
    donationForm.style.width = '50%'
    donationForm.style.margin = '10px'
    // donationForm.style.backgroundColor = 'red'
    widgetDiv.className = 'widget-with-form'
    widgetDiv.style.backgroundColor = 'white'
    // widgetDiv.style.height = '350px !important'
    widgetDiv.appendChild(donationForm)

    widgetDiv.style.display = 'flex'
    widgetDiv.style.flexDirection = 'row'
    widgetDiv.style.width = '800px'

    var labelDiv = document.createElement('div')
    labelDiv.id = 'block-div' + widgetDiv.dataset.slug
    labelDiv.className = 'block-div'
    // labelDiv.style.display = 'flex'
    // labelDiv.style.flexDirection = 'column'
    donationForm.appendChild(labelDiv)

    fundraiserIdLabel = document.createElement('label')
    fundraiserIdLabel.id = 'fundraiser-id-label' + widgetDiv.dataset.slug
    fundraiserIdLabel.style.display = 'none'
    fundraiserIdLabel.style.float = 'left'
    labelDiv.appendChild(fundraiserIdLabel)

    var label1 = document.createElement('label')
    label1.id = 'secure-donation-label' + widgetDiv.dataset.slug
    label1.className = 'secure-donation-label'
    if (widgetDiv.dataset.lang === 'nl') {
      label1.innerText = 'Veilig online doneren'
    } else if (widgetDiv.dataset.lang === 'de') {
      label1.innerText = 'Gesicherte Online-Spende'
    } else if (widgetDiv.dataset.lang === 'es') {
      label1.innerText = 'Donación en línea segura'
    } else {
      label1.innerText = 'Secured Online Donation'
    }
    labelDiv.appendChild(label1)

    var label2 = document.createElement('label')
    label2.id = 'label2' + widgetDiv.dataset.slug
    label2.className = 'label2'
    if (widgetDiv.dataset.lang === 'nl') {
      label2.innerText = 'Voer je donatie in'
    } else if (widgetDiv.dataset.lang === 'de') {
      label2.innerText = 'Geben Sie Ihre Spende ein'
    } else if (widgetDiv.dataset.lang === 'es') {
      label2.innerText = 'Ingrese su donación'
    } else {
      label2.innerText = 'Enter your donation'
    }
    labelDiv.appendChild(label2)

    // ------------------ period intervals --------------------

    var periodDiv = document.createElement('div')
    periodDiv.id = 'period-intervals' + widgetDiv.dataset.slug
    periodDiv.className = 'period-intervals'
    donationForm.appendChild(periodDiv)

    var periodOnetimeDiv = document.createElement('div')
    periodOnetimeDiv.id = 'period-intervals-onetime+' + widgetDiv.dataset.slug
    periodOnetimeDiv.className = 'period-intervals-onetime'

    var oneTimeLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      oneTimeLabel.innerText = 'Eenmalig'
    } else if (widgetDiv.dataset.lang === 'de') {
      oneTimeLabel.innerText = 'Einmalig'
    } else if (widgetDiv.dataset.lang === 'es') {
      oneTimeLabel.innerText = 'Una Vez'
    } else {
      oneTimeLabel.innerText = 'One time'
    }
    oneTimeLabel.id = 'onetime-label' + widgetDiv.dataset.slug
    oneTimeLabel.fontSize = '14px'
    oneTimeLabel.style.display = 'block'
    oneTimeLabel.style.width = '100%'
    oneTimeLabel.onclick = () =>
      this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

    var oneTimeRadio = document.createElement('input')
    oneTimeRadio.setAttribute('type', 'radio')
    oneTimeRadio.id = 'onetime' + widgetDiv.dataset.slug
    oneTimeRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    oneTimeRadio.value = '1'
    oneTimeRadio.checked = true
    oneTimeRadio.onclick = () =>
      this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

    periodOnetimeDiv.appendChild(oneTimeRadio)
    periodOnetimeDiv.appendChild(oneTimeLabel)
    periodDiv.appendChild(periodOnetimeDiv)

    var periodMonthlyDiv = document.createElement('div')
    periodMonthlyDiv.id = 'period-intervals-monthly+' + widgetDiv.dataset.slug
    periodMonthlyDiv.className = 'period-intervals-monthly'

    var monthlyLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      monthlyLabel.innerText = 'Maandelijks'
    } else if (widgetDiv.dataset.lang === 'de') {
      monthlyLabel.innerText = 'Monatlich'
    } else if (widgetDiv.dataset.lang === 'es') {
      monthlyLabel.innerText = 'Mensualmente'
    } else {
      monthlyLabel.innerText = 'Monthly'
    }
    monthlyLabel.id = 'monthly-label' + widgetDiv.dataset.slug
    monthlyLabel.fontSize = '14px'
    monthlyLabel.style.display = 'block'
    monthlyLabel.style.width = '100%'
    monthlyLabel.onclick = () =>
      this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

    var monthlyRadio = document.createElement('input')
    monthlyRadio.setAttribute('type', 'radio')
    monthlyRadio.id = 'monthly' + widgetDiv.dataset.slug
    monthlyRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    monthlyRadio.value = '2'
    monthlyRadio.onclick = () =>
      this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

    periodMonthlyDiv.appendChild(monthlyRadio)
    periodMonthlyDiv.appendChild(monthlyLabel)
    periodDiv.appendChild(periodMonthlyDiv)

    var periodYearlyDiv = document.createElement('div')
    periodYearlyDiv.id = 'period-intervals-yearly+' + widgetDiv.dataset.slug
    periodYearlyDiv.className = 'period-intervals-yearly'

    var yearlyLabel = document.createElement('label')
    if (widgetDiv.dataset.lang === 'nl') {
      yearlyLabel.innerText = 'Jaarlijks'
    } else if (widgetDiv.dataset.lang === 'de') {
      yearlyLabel.innerText = 'Jährlich'
    } else if (widgetDiv.dataset.lang === 'es') {
      yearlyLabel.innerText = 'Anualmente'
    } else {
      yearlyLabel.innerText = 'Yearly'
    }
    yearlyLabel.id = 'yearly-label' + widgetDiv.dataset.slug
    yearlyLabel.fontSize = '14px'
    yearlyLabel.style.display = 'block'
    yearlyLabel.style.width = '100%'
    yearlyLabel.onclick = () =>
      this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

    var yearlyRadio = document.createElement('input')
    yearlyRadio.setAttribute('type', 'radio')
    yearlyRadio.id = 'yearly' + widgetDiv.dataset.slug
    yearlyRadio.name = 'period-intervals' + widgetDiv.dataset.slug
    yearlyRadio.value = '3'
    yearlyRadio.onclick = () =>
      this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

    periodYearlyDiv.appendChild(yearlyRadio)
    periodYearlyDiv.appendChild(yearlyLabel)
    periodDiv.appendChild(periodYearlyDiv)

    // ------------------ period intervals --------------------

    var hrule = document.createElement('hr')
    hrule.style.background = '#E8E8E8'
    hrule.style.height = '2px'
    hrule.style.display = 'flex'
    hrule.style.flexDirection = 'row'
    hrule.style.justifyContent = 'space-between'
    hrule.style.border = 'transparent'
    donationForm.appendChild(hrule)

    var oneTimeBar = document.createElement('div')
    oneTimeBar.id = 'onetime-bar' + widgetDiv.dataset.slug
    oneTimeBar.className = 'onetime-bar'
    oneTimeBar.style.height = '2px'
    oneTimeBar.style.width = '100%'
    oneTimeBar.style.background = '#112FEB'
    hrule.appendChild(oneTimeBar)

    var monthlyBar = document.createElement('div')
    monthlyBar.id = 'monthly-bar' + widgetDiv.dataset.slug
    monthlyBar.className = 'monthly-bar'
    monthlyBar.style.height = '2px'
    monthlyBar.style.width = '100%'
    monthlyBar.style.background = '#E8E8E8'
    hrule.appendChild(monthlyBar)

    var yearlyBar = document.createElement('div')
    yearlyBar.id = 'yearly-bar' + widgetDiv.dataset.slug
    yearlyBar.className = 'yearly-bar'
    yearlyBar.style.height = '2px'
    yearlyBar.style.width = '100%'
    yearlyBar.style.background = '#E8E8E8'
    hrule.appendChild(yearlyBar)

    var selectAmountLabelDiv = document.createElement('div')
    selectAmountLabelDiv.id = 'select-amount-div' + widgetDiv.dataset.slug
    selectAmountLabelDiv.className = 'select-amount-div'

    var selectAmountlabel = document.createElement('label')
    selectAmountlabel.id = 'select-amount-label' + widgetDiv.dataset.slug
    selectAmountlabel.className = 'select-amount-label'
    if (widgetDiv.dataset.lang === 'nl') {
      selectAmountlabel.innerText = 'Anders'
    } else if (widgetDiv.dataset.lang === 'de') {
      selectAmountlabel.innerText = 'Betrag'
    } else if (widgetDiv.dataset.lang === 'es') {
    } else {
      selectAmountlabel.innerText = 'Amount'
    }
    selectAmountlabel.style.fontSize = '16px'
    selectAmountlabel.fontWeight = '700'
    selectAmountLabelDiv.appendChild(selectAmountlabel)
    donationForm.appendChild(selectAmountLabelDiv)

    // ----------- copied from here -----------------------

    var amountDiv = document.createElement('div')
    amountDiv.id = 'select-amount-div-boxes' + widgetDiv.dataset.slug
    amountDiv.className = 'select-amount-div-boxes'
    amountDiv.style.display = 'flex'
    amountDiv.style.marginTop = '10px'
    amountDiv.style.flexDirection = 'row'
    amountDiv.style.justifyContent = 'space-around'
    donationForm.appendChild(amountDiv)

    var firstAmount = document.createElement('div')
    firstAmount.id = 'first-amount-div' + widgetDiv.dataset.slug
    firstAmount.className = 'first-amount-div'
    // firstAmount.style.display = 'flex'
    // firstAmount.style.flexDirection = 'row'
    // firstAmount.style.height = '45px'
    // firstAmount.style.width = '60px'
    // firstAmount.style.borderRadius = '5px'
    // firstAmount.style.border = '1px black solid'
    // firstAmount.style.backgroundColor = '#2828d6'
    firstAmount.style.color = 'white'

    var firstAmountRadio = document.createElement('input')
    firstAmountRadio.setAttribute('type', 'radio')
    firstAmountRadio.id = 'first-amount' + widgetDiv.dataset.slug
    firstAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    firstAmountRadio.value = '25'
    firstAmountRadio.style.marginTop = '15px'
    firstAmountRadio.checked = true

    var firstAmountLabel = document.createElement('label')
    firstAmountLabel.id = 'first-amount-label+' + widgetDiv.dataset.slug
    firstAmountLabel.className = 'first-amount-label'
    firstAmountLabel.innerText = '€25'
    firstAmountLabel.style.fontSize = '16px'
    firstAmountLabel.style.fontWeight = '700'
    firstAmountLabel.style.marginTop = '12px'
    firstAmountLabel.style.display = 'block'
    firstAmountLabel.onclick = () =>
      this.handleSelectAmount('first', firstAmountLabel.id, '')

    firstAmount.appendChild(firstAmountRadio)
    firstAmount.appendChild(firstAmountLabel)

    amountDiv.appendChild(firstAmount)

    var secondAmount = document.createElement('div')
    secondAmount.id = 'second-amount-div' + widgetDiv.dataset.slug
    secondAmount.className = 'second-amount-div'
    // secondAmount.style.height = '45px'
    // secondAmount.style.width = '60px'
    // secondAmount.style.borderRadius = '5px'
    // secondAmount.style.border = '1px black solid'
    // secondAmount.style.display = 'flex'
    // secondAmount.style.flexDirection = 'row'

    var secondAmountRadio = document.createElement('input')
    secondAmountRadio.setAttribute('type', 'radio')
    secondAmountRadio.id = 'second-amount' + widgetDiv.dataset.slug
    secondAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    secondAmountRadio.value = '50'
    secondAmountRadio.style.marginTop = '15px'

    var secondAmountLabel = document.createElement('label')
    secondAmountLabel.id = 'second-amount-label+' + widgetDiv.dataset.slug
    secondAmountLabel.className = 'second-amount-label'
    secondAmountLabel.innerText = '€50'
    secondAmountLabel.style.fontSize = '16px'
    secondAmountLabel.style.fontWeight = '700'
    secondAmountLabel.style.marginTop = '12px'
    secondAmountLabel.style.display = 'block'
    secondAmountLabel.onclick = () =>
      this.handleSelectAmount('second', secondAmountLabel.id, '')

    secondAmount.appendChild(secondAmountRadio)
    secondAmount.appendChild(secondAmountLabel)

    amountDiv.appendChild(secondAmount)

    var thirdAmount = document.createElement('div')
    thirdAmount.id = 'third-amount-div' + widgetDiv.dataset.slug
    thirdAmount.className = 'third-amount-div'
    // thirdAmount.style.height = '45px'
    // thirdAmount.style.width = '60px'
    // thirdAmount.style.borderRadius = '5px'
    // thirdAmount.style.border = '1px black solid'
    // thirdAmount.style.display = 'flex'
    // thirdAmount.style.flexDirection = 'row'

    var thirdAmountRadio = document.createElement('input')
    thirdAmountRadio.setAttribute('type', 'radio')
    thirdAmountRadio.id = 'third-amount' + widgetDiv.dataset.slug
    thirdAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    thirdAmountRadio.value = '75'
    thirdAmountRadio.style.marginTop = '15px'

    var thirdAmountLable = document.createElement('label')
    thirdAmountLable.id = 'third-amount-label+' + widgetDiv.dataset.slug
    thirdAmountLable.className = 'third-amount-label'
    thirdAmountLable.innerText = '€75'
    thirdAmountLable.style.fontSize = '16px'
    thirdAmountLable.style.fontWeight = '700'
    thirdAmountLable.style.marginTop = '12px'
    thirdAmountLable.style.display = 'block'
    thirdAmountLable.onclick = () =>
      this.handleSelectAmount('third', thirdAmountLable.id, '')

    thirdAmount.appendChild(thirdAmountRadio)
    thirdAmount.appendChild(thirdAmountLable)

    amountDiv.appendChild(thirdAmount)

    var forthAmount = document.createElement('div')
    forthAmount.id = 'forth-amount-div' + widgetDiv.dataset.slug
    forthAmount.className = 'forth-amount-div'
    // forthAmount.style.height = '45px'
    // forthAmount.style.width = '60px'
    // forthAmount.style.borderRadius = '5px'
    // forthAmount.style.border = '1px black solid'
    // forthAmount.style.display = 'flex'
    // forthAmount.style.flexDirection = 'row'

    var forthAmountRadio = document.createElement('input')
    forthAmountRadio.setAttribute('type', 'radio')
    forthAmountRadio.id = 'forth-amount' + widgetDiv.dataset.slug
    forthAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    forthAmountRadio.value = '100'
    forthAmountRadio.style.marginTop = '15px'

    var forthAmountLabel = document.createElement('label')
    forthAmountLabel.id = 'forth-amount-label+' + widgetDiv.dataset.slug
    forthAmountLabel.className = 'forth-amount-label'
    forthAmountLabel.innerText = '€100'
    forthAmountLabel.style.fontSize = '16px'
    forthAmountLabel.style.fontWeight = '700'
    forthAmountLabel.style.marginTop = '12px'
    forthAmountLabel.style.display = 'block'
    forthAmountLabel.onclick = () =>
      this.handleSelectAmount('forth', forthAmountLabel.id, '')

    forthAmount.appendChild(forthAmountRadio)
    forthAmount.appendChild(forthAmountLabel)

    amountDiv.appendChild(forthAmount)

    var otherAmount = document.createElement('div')
    otherAmount.id = 'other-amount-div' + widgetDiv.dataset.slug
    otherAmount.className = 'other-amount-div'
    // otherAmount.style.height = '45px'
    // otherAmount.style.width = '60px'
    // otherAmount.style.borderRadius = '5px'
    // otherAmount.style.border = '1px black solid'
    // otherAmount.style.display = 'flex'
    // otherAmount.style.flexDirection = 'row'

    var otherAmountRadio = document.createElement('input')
    otherAmountRadio.setAttribute('type', 'radio')
    otherAmountRadio.id = 'other-amount' + widgetDiv.dataset.slug
    otherAmountRadio.name = 'select-amount' + widgetDiv.dataset.slug
    otherAmountRadio.value = 'other'
    otherAmountRadio.style.marginTop = '15px'

    var otherAmountLabel = document.createElement('label')
    otherAmountLabel.id = 'other-amount-label+' + widgetDiv.dataset.slug
    otherAmountLabel.className = 'other-amount-label'
    if (widgetDiv.dataset.lang === 'nl') {
      otherAmountLabel.innerText = 'Bedrag'
    } else if (widgetDiv.dataset.lang === 'de') {
      otherAmountLabel.innerText = 'Andere'
    } else if (widgetDiv.dataset.lang === 'es') {
      otherAmountLabel.innerText = 'Cantidad'
    } else {
      otherAmountLabel.innerText = 'Other'
    }
    otherAmountLabel.style.fontSize = '16px'
    otherAmountLabel.style.fontWeight = '700'
    otherAmountLabel.style.marginTop = '12px'
    otherAmountLabel.style.display = 'block'
    otherAmountLabel.onclick = () =>
      this.handleSelectAmount('other', otherAmountLabel.id, '')
    otherAmount.appendChild(otherAmountRadio)
    otherAmount.appendChild(otherAmountLabel)

    amountDiv.appendChild(otherAmount)

    var otherAmountInputDiv = document.createElement('div')
    otherAmountInputDiv.id = 'other-amount-input-div+' + widgetDiv.dataset.slug
    otherAmountInputDiv.className = 'other-amount-input-div'

    var otherAmountInput = document.createElement('input')
    otherAmount.setAttribute('type', 'number')
    if (widgetDiv.dataset.lang === 'nl') {
      otherAmountInput.placeholder = 'Ander bedrag'
    } else if (widgetDiv.dataset.lang === 'de') {
      otherAmountInput.placeholder = 'Anderer betrag'
    } else if (widgetDiv.dataset.lang === 'es') {
      otherAmountInput.placeholder = 'Otra cantidad'
    } else {
      otherAmountInput.placeholder = 'Other amount'
    }
    otherAmountInput.id = 'other-amount-input' + widgetDiv.dataset.slug
    otherAmountInput.value = '€ '
    otherAmountInput.onkeyup = (e) =>
      this.handleOtherAmountInput(e.target.value, otherAmountInput.id)
    otherAmountInputDiv.appendChild(otherAmountInput)
    donationForm.appendChild(otherAmountInputDiv)

    var missingAmountMsg = document.createElement('p')
    missingAmountMsg.id = 'missing-error-msg-amount' + widgetDiv.dataset.slug
    missingAmountMsg.className = 'missing-error-msg-amount'
    if (widgetDiv.dataset.lang === 'nl') {
      missingAmountMsg.innerText = 'Minimaal €5,-'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingAmountMsg.innerText = 'Mindestens €5,-'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingAmountMsg.innerText = 'Mínimo de €5,-'
    } else {
      missingAmountMsg.innerText = 'Minimum €5,-'
    }
    donationForm.appendChild(missingAmountMsg)

    var donorInfoDiv = document.createElement('div')
    donorInfoDiv.id = 'donor-info-div' + widgetDiv.dataset.slug
    donorInfoDiv.className = 'donor-info-div'
    donationForm.appendChild(donorInfoDiv)

    var firstNameInput = document.createElement('input')
    firstNameInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      firstNameInput.placeholder = 'Voornaam'
    } else if (widgetDiv.dataset.lang === 'de') {
      firstNameInput.placeholder = 'Voornaam'
    } else if (widgetDiv.dataset.lang === 'es') {
      firstNameInput.placeholder = 'Nombre'
    } else {
      firstNameInput.placeholder = 'First name'
    }
    firstNameInput.id = 'first-name-field' + widgetDiv.dataset.slug
    firstNameInput.className = 'first-name-field'
    donorInfoDiv.appendChild(firstNameInput)

    var missingFirstNameMsg = document.createElement('p')
    missingFirstNameMsg.id =
      'missing-error-msg-first-name' + widgetDiv.dataset.slug
    missingFirstNameMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingFirstNameMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingFirstNameMsg.innerText =
        'Muss zwischen 1 und 30 Zeichen lang sein.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingFirstNameMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
    } else {
      missingFirstNameMsg.innerText = 'Must be between 1 and 30 characters.'
    }
    donorInfoDiv.appendChild(missingFirstNameMsg)

    var lastNameInput = document.createElement('input')
    lastNameInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      lastNameInput.placeholder = 'Achternaam'
    } else if (widgetDiv.dataset.lang === 'de') {
      lastNameInput.placeholder = 'Nachname'
    } else if (widgetDiv.dataset.lang === 'es') {
      lastNameInput.placeholder = 'Apellido'
    } else {
      lastNameInput.placeholder = 'Last name'
    }
    lastNameInput.id = 'last-name-field' + widgetDiv.dataset.slug
    lastNameInput.className = 'last-name-field'
    donorInfoDiv.appendChild(lastNameInput)

    var missingLastNameMsg = document.createElement('p')
    missingLastNameMsg.id =
      'missing-error-msg-last-name' + widgetDiv.dataset.slug
    missingLastNameMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingLastNameMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingLastNameMsg.innerText = 'Muss zwischen 1 und 30 Zeichen lang sein.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingLastNameMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
    } else {
      missingLastNameMsg.innerText = 'Must be between 1 and 30 characters.'
    }
    donorInfoDiv.appendChild(missingLastNameMsg)

    var emailInput = document.createElement('input')
    emailInput.setAttribute('type', 'text')
    if (widgetDiv.dataset.lang === 'nl') {
      emailInput.placeholder = 'Emailadres'
    } else if (widgetDiv.dataset.lang === 'de') {
      emailInput.placeholder = 'E-Mail-Adresse'
    } else if (widgetDiv.dataset.lang === 'es') {
      emailInput.placeholder = 'Dirección de email'
    } else {
      emailInput.placeholder = 'Email'
    }
    emailInput.id = 'email-field' + widgetDiv.dataset.slug
    emailInput.className = 'email-field'
    donorInfoDiv.appendChild(emailInput)

    var missingEmailMsg = document.createElement('p')
    missingEmailMsg.id = 'missing-error-msg-email' + widgetDiv.dataset.slug
    missingEmailMsg.className = 'missing-error-msg'
    if (widgetDiv.dataset.lang === 'nl') {
      missingEmailMsg.innerText = 'Onjuist emailadres.'
    } else if (widgetDiv.dataset.lang === 'de') {
      missingEmailMsg.innerText = 'Falsche E-Mail-Adresse.'
    } else if (widgetDiv.dataset.lang === 'es') {
      missingEmailMsg.innerText = 'Dirección de E-Mail incorrecta.'
    } else {
      missingEmailMsg.innerText = 'Incorrect email address.'
    }
    donorInfoDiv.appendChild(missingEmailMsg)

    createTipbox(
      donationForm,
      null,
      widgetDiv.dataset.slug,
      '',
      widgetDiv.dataset.lang
    )
    calculateTotalAmount(widgetDiv.dataset.slug)

    // ----------- copied from here -----------------------

    var anonymousDiv=addAnonymousBox(widgetDiv.dataset.slug, widgetDiv.dataset.lang)
    donationForm.appendChild(anonymousDiv)

    donateBtnDiv = document.createElement('div')
    donateBtnDiv.id = 'donate-btn-in-form-div+' + widgetDiv.dataset.slug
    donateButton.id = 'donate-btn-in-form+' + widgetDiv.dataset.slug
    donateButton.className = 'donate-btn-in-form'
    if (widgetDiv.dataset.lang === 'nl') {
      donateButton.innerHTML = '<i class="fa"></i> Doneer'
    } else if (widgetDiv.dataset.lang === 'de') {
      donateButton.innerHTML = '<i class="fa"></i> Spenden'
    } else if (widgetDiv.dataset.lang === 'es') {
      donateButton.innerHTML = '<i class="fa"></i> Donar'
    } else {
      donateButton.innerHTML = '<i class="fa"></i> Donate'
    }
    donateButton.onclick = () =>
      this.directDonate(donateBtnDiv.id, widgetDiv.dataset.lang)
    donateBtnDiv.appendChild(donateButton)
    donationForm.appendChild(donateBtnDiv)

    var poweredByDiv = document.createElement('div')
    poweredByDiv.id = 'powered-by-div+' + widgetDiv.dataset.slug
    poweredByDiv.className = 'powered-by-div-in-form'
    donationForm.appendChild(poweredByDiv)

    var poweredByLabel = document.createElement('label')
    poweredByLabel.id = 'powered-by-label+' + widgetDiv.dataset.slug
    poweredByLabel.className = 'powered-by-label'
    if (widgetDiv.dataset.lang === 'nl') {
      poweredByLabel.textContent = 'Ondersteund door '
    } else if (widgetDiv.dataset.lang === 'de') {
      poweredByLabel.textContent = 'Angetrieben von '
    } else if (widgetDiv.dataset.lang === 'es') {
    } else {
      poweredByLabel.textContent = 'Powered by '
    }
    poweredByDiv.appendChild(poweredByLabel)

    var whydonateLogo = document.createElement('img')
    whydonateLogo.id = 'whydonate-logo+' + widgetDiv.dataset.slug
    whydonateLogo.className = 'whydonate-logo'
    whydonateLogo.src =
      'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/whydonate-logo-licht.webp'
    if (widgetDiv.dataset.lang === 'nl') {
      whydonateLogo.onclick = () => {
        window.location.href = 'https://www.whydonate.nl/'
      }
    } else {
      whydonateLogo.onclick = () => {
        window.location.href = 'https://www.whydonate.eu/'
      }
    }
    poweredByDiv.appendChild(whydonateLogo)

    // create right side
    var fundraiserInfoDiv = document.createElement('DIV')
    fundraiserInfoDiv.id = 'fundraiser-info-div' + widgetDiv.dataset.slug
    fundraiserInfoDiv.className = 'fundraiser-info-div'

    fundraiserInfoDiv.style.height = '100%'
    fundraiserInfoDiv.style.width = '50%'
    fundraiserInfoDiv.style.backgroundColor = 'rgb(248, 245, 245)'
    fundraiserInfoDiv.style.borderRadius = '10px'

    widgetDiv.appendChild(fundraiserInfoDiv)

    // fundraiserImage = document.createElement('IMG')
    // fundraiserImage.id = 'fundraiser-image' + widgetDiv.dataset.slug
    // fundraiserImage.className = 'fundraiser-image'
    // fundraiserImage.style.height = '150px'
    // fundraiserImage.style.width = '100%'
    // fundraiserImage.style.marginBottom = '10px'
    // fundraiserImage.style.borderTopLeftRadius = '15px'
    // fundraiserImage.style.borderTopRightRadius = '15px'

    // widgetDiv.style.height = '350px'

    // var blankDiv = document.createElement('DIV')
    // blankDiv.id = 'blank-div'
    // blankDiv.style.width = '100%'
    // fundraiserInfoDiv.appendChild(fundraiserImage)
    // fundraiserInfoDiv.appendChild(blankDiv)

    var amountInfoDiv = document.createElement('div')
    amountInfoDiv.id = 'amount-info-div' + widgetDiv.dataset.slug
    amountInfoDiv.className = 'amount-info-div'

    var receiveAmount = document.createElement('LABEL')
    receiveAmount.id = 'receive-amount' + widgetDiv.dataset.slug
    receiveAmount.className = 'receive-amount'
    amountInfoDiv.appendChild(receiveAmount)
    // fundraiserInfoDiv.appendChild(receiveAmount)

    var targetAmount = document.createElement('LABEL')
    targetAmount.id = 'target-amount' + widgetDiv.dataset.slug
    targetAmount.className = 'target-amount'
    amountInfoDiv.appendChild(targetAmount)
    // fundraiserInfoDiv.appendChild(targetAmount)

    fundraiserInfoDiv.appendChild(amountInfoDiv)

    var progressBarDiv = document.createElement('div')
    progressBarDiv.id = 'progress-bar-div' + widgetDiv.dataset.slug
    progressBarDiv.className = 'progress-bar-div'

    var progressBar = document.createElement('DIV')
    progressBar.id = 'progress-bar' + widgetDiv.dataset.slug
    progressBar.className = 'progress-bar'
    progressBarDiv.appendChild(progressBar)
    fundraiserInfoDiv.appendChild(progressBarDiv)

    var raisedBar = document.createElement('DIV')
    raisedBar.id = 'raised-bar' + widgetDiv.dataset.slug
    raisedBar.className = 'raised-bar'
    progressBar.appendChild(raisedBar)

    var progressFormDiv = document.createElement('div')
    progressFormDiv.id = 'progress-form-div' + widgetDiv.dataset.slug
    progressFormDiv.className = 'progress-form-div'

    progressDiv = document.createElement('DIV')
    progressDiv.id = 'progress-div' + widgetDiv.dataset.slug
    progressDiv.className = 'progress-div'

    progressFormDiv.appendChild(progressDiv)
    fundraiserInfoDiv.appendChild(progressFormDiv)

    var raisedLabel = document.createElement('LABEL')
    raisedLabel.id = 'raised-label' + widgetDiv.dataset.slug
    raisedLabel.className = 'raised-label'
    progressDiv.appendChild(raisedLabel)

    var daysLabel = document.createElement('LABEL')
    daysLabel.id = 'remaining-days' + widgetDiv.dataset.slug
    daysLabel.className = 'remaining-days'
    progressDiv.appendChild(daysLabel)

    var rightSideRule = document.createElement('div')
    rightSideRule.id = 'right-side-rule' + widgetDiv.dataset.slug
    rightSideRule.className = 'right-side-rule'
    progressFormDiv.appendChild(rightSideRule)
    fundraiserInfoDiv.appendChild(progressFormDiv)
  } else {
    var blankDiv = document.createElement('DIV')
    blankDiv.style.height = '20px'
    blankDiv.style.width = '100%'
    widgetDiv.appendChild(blankDiv)

    var amountInfoDiv = document.createElement('div')
    amountInfoDiv.id = 'amount-info-div-only-image' + widgetDiv.dataset.slug
    amountInfoDiv.className = 'amount-info-div-only-image'
    widgetDiv.appendChild(amountInfoDiv)

    var receiveAmount = document.createElement('LABEL')
    receiveAmount.id = 'receive-amount' + widgetDiv.dataset.slug
    receiveAmount.className = 'receive-amount'
    amountInfoDiv.appendChild(receiveAmount)

    var targetAmount = document.createElement('LABEL')
    targetAmount.id = 'target-amount' + widgetDiv.dataset.slug
    targetAmount.className = 'target-amount'
    amountInfoDiv.appendChild(targetAmount)

    var progressBar = document.createElement('DIV')
    progressBar.id = 'progress-bar' + widgetDiv.dataset.slug
    progressBar.className = 'progress-bar'
    widgetDiv.appendChild(progressBar)

    var raisedBar = document.createElement('DIV')
    raisedBar.id = 'raised-bar' + widgetDiv.dataset.slug
    raisedBar.className = 'raised-bar'
    progressBar.appendChild(raisedBar)

    var progressDiv = document.createElement('DIV')
    progressDiv.id = 'progress-div' + widgetDiv.dataset.slug
    progressDiv.className = 'progress-div'
    widgetDiv.appendChild(progressDiv)

    var raisedLabel = document.createElement('LABEL')
    raisedLabel.id = 'raised-label' + widgetDiv.dataset.slug
    raisedLabel.className = 'raised-label'
    progressDiv.appendChild(raisedLabel)

    var daysLabel = document.createElement('LABEL')
    daysLabel.id = 'remaining-days' + widgetDiv.dataset.slug
    daysLabel.className = 'remaining-days'
    progressDiv.appendChild(daysLabel)

    var donateBtnDiv = document.createElement('div')
    donateBtnDiv.id = 'donate-btn-div+' + widgetDiv.dataset.slug
    donateButton.id = 'donate-btn+' + widgetDiv.dataset.slug
    donateButton.className = 'donate-btn'
    if (widgetDiv.dataset.lang === 'nl') {
      donateButton.innerHTML = '<i class="fa"></i> Doneer'
    } else if (widgetDiv.dataset.lang === 'de') {
      donateButton.innerHTML = '<i class="fa"></i> Spenden'
    } else if (widgetDiv.dataset.lang === 'es') {
      donateButton.innerHTML = '<i class="fa"></i> Donar'
    } else {
      donateButton.innerHTML = '<i class="fa"></i> Donate'
    }
    donateButton.onclick = () => this.handleDonate(donateBtnDiv.id)
    donateBtnDiv.appendChild(donateButton)
    widgetDiv.appendChild(donateBtnDiv)
  }
}

function handlePeriodInterval(value, idValue, color, fundraiserInfo) {
  var slug = idValue.split('+')[1]
  var onetimeBar = document.getElementById('onetime-bar' + slug)
  var monthlyBar = document.getElementById('monthly-bar' + slug)
  var yearlyBar = document.getElementById('yearly-bar' + slug)

  var onetimeRadio = document.getElementById('onetime' + slug)
  var monthlyRadio = document.getElementById('monthly' + slug)
  var yearlyRadio = document.getElementById('yearly' + slug)

  onetimeBar.style.backgroundColor = color ? color : '#112FEB'
  monthlyBar.style.backgroundColor = color ? color : '#112FEB'
  yearlyBar.style.backgroundColor = color ? color : '#112FEB'

  if (value === 1) {
    onetimeRadio.checked = true
    monthlyRadio.checked = false
    yearlyRadio.checked = false
    monthlyBar.style.backgroundColor = '#E8E8E8'
    yearlyBar.style.backgroundColor = '#E8E8E8'
    renderSelectAmount(fundraiserInfo, slug, 'onetime')
  } else if (value === 2) {
    monthlyRadio.checked = true
    onetimeRadio.checked = false
    yearlyRadio.checked = false
    onetimeBar.style.backgroundColor = '#E8E8E8'
    yearlyBar.style.backgroundColor = '#E8E8E8'
    renderSelectAmount(fundraiserInfo, slug, 'monthly')
  } else {
    yearlyRadio.checked = true
    monthlyRadio.checked = false
    onetimeRadio.checked = false
    onetimeBar.style.backgroundColor = '#E8E8E8'
    monthlyBar.style.backgroundColor = '#E8E8E8'
    renderSelectAmount(fundraiserInfo, slug, 'yearly')
  }
}

function handleSelectAmount(value, idValue, color) {
  var slug = idValue.split('+')[1]
  var firstAmountdiv = document.getElementById('first-amount-div' + slug)
  var secondAmountdiv = document.getElementById('second-amount-div' + slug)
  var thirdAmountdiv = document.getElementById('third-amount-div' + slug)
  var forthAmountdiv = document.getElementById('forth-amount-div' + slug)
  var otherAmountdiv = document.getElementById('other-amount-div' + slug)
  var otherAmountBoxDiv = document.getElementById('other-amount-div' + slug)

  var firstAmountLabel = document.getElementById('first-amount-label+' + slug)
  var secondAmountLabel = document.getElementById('second-amount-label+' + slug)
  var thirdAmountLabel = document.getElementById('third-amount-label+' + slug)
  var forthAmountLabel = document.getElementById('forth-amount-label+' + slug)
  var otherAmountLabel = document.getElementById('other-amount-label+' + slug)

  var otherAmountDiv = document.getElementById('other-amount-input-div+' + slug)

  var firstAmountRadio = document.getElementById('first-amount' + slug)
  var secondAmountRadio = document.getElementById('second-amount' + slug)
  var thirdAmountRadio = document.getElementById('third-amount' + slug)
  var forthAmountRadio = document.getElementById('forth-amount' + slug)
  var otherAmountRadio = document.getElementById('other-amount' + slug)

  var amountErrMsg = document.getElementById('missing-error-msg-amount' + slug)

  // console.log('color value ', color ? color : '')
  if (value === 'first') {
    otherAmountDiv.style.display = 'none'
    amountErrMsg.style.display = 'none'
    otherAmountDiv.style.visibility = 'hidden'
    firstAmountRadio.checked = true

    firstAmountdiv.style.backgroundColor = color ? color : '#2828d6'
    firstAmountdiv.style.color = 'white'
    firstAmountdiv.style.border = 'transparent'
    firstAmountLabel.style.color = 'white'

    secondAmountdiv.style.backgroundColor = 'transparent'
    secondAmountdiv.style.color = 'black'
    secondAmountdiv.style.border = '1px solid black'
    secondAmountLabel.style.color = 'black'

    thirdAmountdiv.style.backgroundColor = 'transparent'
    thirdAmountdiv.style.color = 'black'
    thirdAmountdiv.style.border = '1px solid black'
    thirdAmountLabel.style.color = 'black'

    forthAmountdiv.style.backgroundColor = 'transparent'
    forthAmountdiv.style.color = 'black'
    forthAmountdiv.style.border = '1px solid black'
    forthAmountLabel.style.color = 'black'

    otherAmountdiv.style.backgroundColor = 'transparent'
    otherAmountdiv.style.color = 'black'
    otherAmountLabel.style.color = 'black'
    otherAmountBoxDiv.style.border = '1px solid black'
  } else if (value === 'second') {
    otherAmountDiv.style.display = 'none'
    amountErrMsg.style.display = 'none'
    otherAmountDiv.style.visibility = 'hidden'
    secondAmountRadio.checked = true

    firstAmountdiv.style.backgroundColor = 'transparent'
    firstAmountdiv.style.color = 'black'
    firstAmountdiv.style.border = '1px solid black'
    firstAmountLabel.style.color = 'black'

    secondAmountdiv.style.backgroundColor = color ? color : '#2828d6'
    secondAmountdiv.style.color = 'white'
    secondAmountdiv.style.border = 'transparent'
    secondAmountLabel.style.color = 'white'

    thirdAmountdiv.style.backgroundColor = 'transparent'
    thirdAmountdiv.style.color = 'black'
    thirdAmountdiv.style.border = '1px solid black'
    thirdAmountLabel.style.color = 'black'

    forthAmountdiv.style.backgroundColor = 'transparent'
    forthAmountdiv.style.color = 'black'
    forthAmountdiv.style.border = '1px solid black'
    forthAmountLabel.style.color = 'black'

    otherAmountdiv.style.backgroundColor = 'transparent'
    otherAmountdiv.style.color = 'black'
    otherAmountLabel.style.color = 'black'
    otherAmountBoxDiv.style.border = '1px solid black'
  } else if (value === 'third') {
    otherAmountDiv.style.display = 'none'
    amountErrMsg.style.display = 'none'
    otherAmountDiv.style.visibility = 'hidden'
    thirdAmountRadio.checked = true

    firstAmountdiv.style.backgroundColor = 'transparent'
    firstAmountdiv.style.color = 'black'
    firstAmountdiv.style.border = '1px solid black'
    firstAmountLabel.style.color = 'black'

    secondAmountdiv.style.backgroundColor = 'transparent'
    secondAmountdiv.style.color = 'black'
    secondAmountdiv.style.border = '1px solid black'
    secondAmountLabel.style.color = 'black'

    thirdAmountdiv.style.backgroundColor = color ? color : '#2828d6'
    thirdAmountdiv.style.color = 'white'
    thirdAmountdiv.style.border = 'transparent'
    thirdAmountLabel.style.color = 'white'

    forthAmountdiv.style.backgroundColor = 'transparent'
    forthAmountdiv.style.color = 'black'
    forthAmountdiv.style.border = '1px solid black'
    forthAmountLabel.style.color = 'black'

    otherAmountdiv.style.backgroundColor = 'transparent'
    otherAmountdiv.style.color = 'black'
    otherAmountLabel.style.color = 'black'
    otherAmountBoxDiv.style.border = '1px solid black'
  } else if (value === 'forth') {
    otherAmountDiv.style.display = 'none'
    amountErrMsg.style.display = 'none'
    otherAmountDiv.style.visibility = 'hidden'
    forthAmountRadio.checked = true

    firstAmountdiv.style.backgroundColor = 'transparent'
    firstAmountdiv.style.color = 'black'
    firstAmountdiv.style.color = '1px solid black'
    firstAmountLabel.style.color = 'black'

    secondAmountdiv.style.backgroundColor = 'transparent'
    secondAmountdiv.style.color = 'black'
    secondAmountdiv.style.border = '1px solid black'
    secondAmountLabel.style.color = 'black'

    thirdAmountdiv.style.backgroundColor = 'transparent'
    thirdAmountdiv.style.color = 'black'
    thirdAmountdiv.style.border = '1px solid black'
    thirdAmountLabel.style.color = 'black'

    forthAmountdiv.style.backgroundColor = color ? color : '#2828d6'
    forthAmountdiv.style.color = 'white'
    forthAmountdiv.style.border = 'transparent'
    forthAmountLabel.style.color = 'white'

    otherAmountdiv.style.backgroundColor = 'transparent'
    otherAmountdiv.style.color = 'black'
    otherAmountLabel.style.color = 'black'
    otherAmountBoxDiv.style.border = '1px solid black'
  } else {
    otherAmountDiv.style.display = 'flex'
    otherAmountDiv.style.visibility = 'visible'
    otherAmountRadio.checked = true

    firstAmountdiv.style.backgroundColor = 'transparent'
    firstAmountdiv.style.color = 'black'
    firstAmountdiv.style.border = '1px solid black'
    firstAmountLabel.style.color = 'black'

    secondAmountdiv.style.backgroundColor = 'transparent'
    secondAmountdiv.style.color = 'black'
    secondAmountdiv.style.border = '1px solid black'
    secondAmountLabel.style.color = 'black'

    thirdAmountdiv.style.backgroundColor = 'transparent'
    thirdAmountdiv.style.color = 'black'
    thirdAmountdiv.style.border = '1px solid black'
    thirdAmountLabel.style.color = 'black'

    forthAmountdiv.style.backgroundColor = 'transparent'
    forthAmountdiv.style.color = 'black'
    forthAmountdiv.style.border = '1px solid black'
    forthAmountLabel.style.color = 'black'

    otherAmountdiv.style.backgroundColor = color ? color : '#2828d6'
    otherAmountdiv.style.color = 'white'
    otherAmountLabel.style.color = 'white'
    otherAmountBoxDiv.style.border = 'transparent'
  }

  var tipbox = document.getElementById('tip-box' + slug)
  if (value !== 'other') {
    document.getElementById('other-amount-input' + slug).value = '€ '
    handleOtherAmountInput(
      document.getElementById('other-amount-input' + slug).value,
      'other-amount-input' + slug
    )
    let amount = parseInt(
      document.getElementById(value + '-amount' + slug).value
    )
    if (amount < 9) {
      renderOptionsForAmount(slug)
    } else {
      renderOptionsForPercentile(slug)
    }
  } else {
    renderOptionsForPercentile(slug)
  }
  setDropdownFunc(tipbox, slug)
  handleTipDropdown(slug)
}

function createModal(slug) {
  var modalDiv = document.createElement('DIV')
  modalDiv.id = 'myModal' + slug
  modalDiv.className = 'modal'
  document.body.appendChild(modalDiv)

  var modalContent = document.createElement('DIV')
  modalContent.id = 'modal-content' + slug
  modalContent.className = 'modal-content'
  modalDiv.appendChild(modalContent)

  var closeDiv = document.createElement('div')
  closeDiv.id = 'close-div' + slug
  closeDiv.className = 'close-div'

  var fundraiserIdLabel = document.createElement('label')
  fundraiserIdLabel.id = 'fundraiser-id-label' + slug
  fundraiserIdLabel.style.display = 'none'
  fundraiserIdLabel.style.float = 'left'
  closeDiv.appendChild(fundraiserIdLabel)
  // closeDiv.style.width = '100%'
  // closeDiv.style.height = '20px'
  // closeDiv.style.backgroundColor = 'red'
  // closeDiv.style.borderRadius = '15px'
  // closeDiv.style.top = '-10px'
  // closeDiv.style.right = '-10px'
  // closeDiv.style.float = 'right'
  modalContent.appendChild(closeDiv)

  var closeSpan = document.createElement('SPAN')
  closeSpan.id = 'close' + slug
  closeSpan.innerHTML = '&times;'
  closeSpan.className = 'close'
  closeDiv.appendChild(closeSpan)

  // var fundraiserIdLabel = document.createElement('label')
  // fundraiserIdLabel.id = 'fundraiser-id-label' + widgetDiv.dataset.slug
  // fundraiserIdLabel.className = 'fundraiser-id-label'
  // modalContent.appendChild(fundraiserIdLabel)
  var donationFormDiv = document.createElement('div')
  donationFormDiv.id = 'modal-donation-form' + slug
  donationFormDiv.className = 'modal-donation-form'
  modalContent.appendChild(donationFormDiv)

  var labelDiv = document.createElement('div')
  labelDiv.id = 'block-div-modal' + slug
  labelDiv.className = 'block-div-modal'
  // labelDiv.style.display = 'flex'
  // labelDiv.style.flexDirection = 'column'
  donationFormDiv.appendChild(labelDiv)

  var label1 = document.createElement('label')
  label1.id = 'secure-donation-label' + widgetDiv.dataset.slug
  label1.className = 'secure-donation-label'
  if (widgetDiv.dataset.lang === 'nl') {
    label1.innerText = 'Veilig online doneren'
  } else if (widgetDiv.dataset.lang === 'de') {
    label1.innerText = 'Gesicherte Online-Spende'
  } else if (widgetDiv.dataset.lang === 'es') {
    label1.innerText = 'Donación en línea segura'
  } else {
    label1.innerText = 'Secured Online Donation'
  }
  labelDiv.appendChild(label1)

  var label2 = document.createElement('label')
  label2.id = 'label2' + slug
  label2.className = 'label2'
  if (widgetDiv.dataset.lang === 'nl') {
    label2.innerText = 'Voer je donatie in'
  } else if (widgetDiv.dataset.lang === 'de') {
    label2.innerText = 'Geben Sie Ihre Spende ein'
  } else if (widgetDiv.dataset.lang === 'es') {
    label2.innerText = 'Ingrese su donación'
  } else {
    label2.innerText = 'Enter your donation'
  }
  labelDiv.appendChild(label2)

  var periodDiv = document.createElement('div')
  periodDiv.id = 'period-intervals' + slug
  periodDiv.className = 'period-intervals'
  donationFormDiv.appendChild(periodDiv)

  var periodOnetimeDiv = document.createElement('div')
  periodOnetimeDiv.id = 'period-intervals-onetime+' + slug
  periodOnetimeDiv.className = 'period-intervals-onetime'

  var oneTimeLabel = document.createElement('label')
  oneTimeLabel.id = 'onetime-label' + slug
  if (widgetDiv.dataset.lang === 'nl') {
    oneTimeLabel.innerText = 'Eenmalig'
  } else if (widgetDiv.dataset.lang === 'de') {
    oneTimeLabel.innerText = 'Einmalig'
  } else if (widgetDiv.dataset.lang === 'es') {
    oneTimeLabel.innerText = 'Una Vez'
  } else {
    oneTimeLabel.innerText = 'One time'
  }
  oneTimeLabel.id = 'onetime-label' + slug
  oneTimeLabel.fontSize = '14px'
  oneTimeLabel.style.display = 'block'
  oneTimeLabel.style.width = '100%'
  oneTimeLabel.onclick = () =>
    this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

  var oneTimeRadio = document.createElement('input')
  oneTimeRadio.setAttribute('type', 'radio')
  oneTimeRadio.id = 'onetime' + slug
  oneTimeRadio.name = 'period-intervals' + slug
  oneTimeRadio.value = '1'
  oneTimeRadio.checked = true
  oneTimeRadio.onclick = () =>
    this.handlePeriodInterval(1, periodOnetimeDiv.id, '', {})

  periodOnetimeDiv.appendChild(oneTimeRadio)
  periodOnetimeDiv.appendChild(oneTimeLabel)
  periodDiv.appendChild(periodOnetimeDiv)

  var periodMonthlyDiv = document.createElement('div')
  periodMonthlyDiv.id = 'period-intervals-monthly+' + slug
  periodMonthlyDiv.className = 'period-intervals-monthly'

  var monthlyLabel = document.createElement('label')
  if (widgetDiv.dataset.lang === 'nl') {
    monthlyLabel.innerText = 'Maandelijks'
  } else if (widgetDiv.dataset.lang === 'de') {
    monthlyLabel.innerText = 'Monatlich'
  } else if (widgetDiv.dataset.lang === 'es') {
    monthlyLabel.innerText = 'Mensualmente'
  } else {
    monthlyLabel.innerText = 'Monthly'
  }
  monthlyLabel.id = 'monthly-label' + slug
  monthlyLabel.fontSize = '14px'
  monthlyLabel.style.display = 'block'
  monthlyLabel.style.width = '100%'
  monthlyLabel.onclick = () =>
    this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

  var monthlyRadio = document.createElement('input')
  monthlyRadio.setAttribute('type', 'radio')
  monthlyRadio.id = 'monthly' + slug
  monthlyRadio.name = 'period-intervals'
  monthlyRadio.value = '2'
  monthlyRadio.onclick = () =>
    this.handlePeriodInterval(2, periodMonthlyDiv.id, '', {})

  periodMonthlyDiv.appendChild(monthlyRadio)
  periodMonthlyDiv.appendChild(monthlyLabel)
  periodDiv.appendChild(periodMonthlyDiv)

  var periodYearlyDiv = document.createElement('div')
  periodYearlyDiv.id = 'period-intervals-yearly+' + slug
  periodYearlyDiv.className = 'period-intervals-yearly'

  var yearlyLabel = document.createElement('label')
  if (widgetDiv.dataset.lang === 'nl') {
    yearlyLabel.innerText = 'Jaarlijks'
  } else if (widgetDiv.dataset.lang === 'de') {
    yearlyLabel.innerText = 'Jährlich'
  } else if (widgetDiv.dataset.lang === 'es') {
    yearlyLabel.innerText = 'Anualmente'
  } else {
    yearlyLabel.innerText = 'Yearly'
  }
  yearlyLabel.id = 'yearly-label' + slug
  yearlyLabel.fontSize = '14px'
  yearlyLabel.style.display = 'block'
  yearlyLabel.style.width = '100%'
  yearlyLabel.onclick = () =>
    this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

  var yearlyRadio = document.createElement('input')
  yearlyRadio.setAttribute('type', 'radio')
  yearlyRadio.id = 'yearly' + slug
  yearlyRadio.name = 'period-intervals'
  yearlyRadio.value = '3'
  yearlyRadio.onclick = () =>
    this.handlePeriodInterval(3, periodYearlyDiv.id, '', {})

  periodYearlyDiv.appendChild(yearlyRadio)
  periodYearlyDiv.appendChild(yearlyLabel)
  periodDiv.appendChild(periodYearlyDiv)

  var hrule = document.createElement('hr')
  hrule.style.background = '#E8E8E8'
  hrule.style.height = '2px'
  hrule.style.width = '100%'
  hrule.style.display = 'flex'
  hrule.style.flexDirection = 'row'
  hrule.style.justifyContent = 'space-between'
  hrule.style.border = 'transparent'
  donationFormDiv.appendChild(hrule)

  var oneTimeBar = document.createElement('div')
  oneTimeBar.id = 'onetime-bar' + slug
  oneTimeBar.className = 'onetime-bar'
  oneTimeBar.style.height = '2px'
  oneTimeBar.style.width = '100%'
  oneTimeBar.style.background = '#112FEB'
  hrule.appendChild(oneTimeBar)

  var monthlyBar = document.createElement('div')
  monthlyBar.id = 'monthly-bar' + slug
  monthlyBar.className = 'monthly-bar'
  monthlyBar.style.height = '2px'
  monthlyBar.style.width = '100%'
  monthlyBar.style.background = '#E8E8E8'
  hrule.appendChild(monthlyBar)

  var yearlyBar = document.createElement('div')
  yearlyBar.id = 'yearly-bar' + slug
  yearlyBar.className = 'yearly-bar'
  yearlyBar.style.height = '2px'
  yearlyBar.style.width = '100%'
  yearlyBar.style.background = '#E8E8E8'
  hrule.appendChild(yearlyBar)

  var selectAmountLabelDiv = document.createElement('div')
  selectAmountLabelDiv.id = 'select-amount-div-modal' + slug
  selectAmountLabelDiv.className = 'select-amount-div-modal'

  var selectAmountlabel = document.createElement('label')
  selectAmountlabel.id = 'select-amount-label' + slug
  selectAmountlabel.className = 'select-amount-label'
  if (widgetDiv.dataset.lang === 'nl') {
    selectAmountlabel.innerText = 'Anders'
  } else if (widgetDiv.dataset.lang === 'de') {
    selectAmountlabel.innerText = 'Betrag'
  } else if (widgetDiv.dataset.lang === 'es') {
  } else {
    selectAmountlabel.innerText = 'Amount'
  }
  selectAmountlabel.style.fontSize = '16px'
  selectAmountlabel.fontWeight = '700'
  selectAmountLabelDiv.appendChild(selectAmountlabel)
  donationFormDiv.appendChild(selectAmountLabelDiv)

  var amountDiv = document.createElement('div')
  amountDiv.id = 'select-amount-div-boxes' + widgetDiv.dataset.slug
  amountDiv.className = 'select-amount-div-boxes'
  amountDiv.style.display = 'flex'
  amountDiv.style.marginTop = '10px'
  amountDiv.style.flexDirection = 'row'
  amountDiv.style.justifyContent = 'space-around'
  donationFormDiv.appendChild(amountDiv)

  var firstAmount = document.createElement('div')
  firstAmount.id = 'first-amount-div' + slug
  firstAmount.className = 'first-amount-div'
  // firstAmount.style.display = 'flex'
  // firstAmount.style.flexDirection = 'row'
  // firstAmount.style.height = '45px'
  // firstAmount.style.width = '60px'
  // firstAmount.style.borderRadius = '5px'
  // firstAmount.style.border = '1px black solid'
  // firstAmount.style.backgroundColor = '#2828d6'
  firstAmount.style.color = 'white'

  var firstAmountRadio = document.createElement('input')
  firstAmountRadio.setAttribute('type', 'radio')
  firstAmountRadio.id = 'first-amount' + slug
  firstAmountRadio.name = 'select-amount' + slug
  firstAmountRadio.value = '25'
  firstAmountRadio.checked = true
  firstAmountRadio.style.marginTop = '15px'

  var firstAmountLabel = document.createElement('label')
  firstAmountLabel.id = 'first-amount-label+' + slug
  firstAmountLabel.className = 'first-amount-label'
  firstAmountLabel.innerText = '€25'
  firstAmountLabel.style.fontSize = '16px'
  firstAmountLabel.style.fontWeight = '700'
  firstAmountLabel.style.marginTop = '12px'
  firstAmountLabel.style.display = 'block'
  firstAmountLabel.onclick = () =>
    this.handleSelectAmount(25, firstAmountLabel.id, '')

  firstAmount.appendChild(firstAmountRadio)
  firstAmount.appendChild(firstAmountLabel)

  amountDiv.appendChild(firstAmount)

  var secondAmount = document.createElement('div')
  secondAmount.id = 'second-amount-div' + slug
  secondAmount.className = 'second-amount-div'
  // secondAmount.style.height = '45px'
  // secondAmount.style.width = '60px'
  // secondAmount.style.borderRadius = '5px'
  // secondAmount.style.border = '1px black solid'
  // secondAmount.style.display = 'flex'
  // secondAmount.style.flexDirection = 'row'

  var secondAmountRadio = document.createElement('input')
  secondAmountRadio.setAttribute('type', 'radio')
  secondAmountRadio.id = 'second-amount' + slug
  secondAmountRadio.name = 'select-amount' + slug
  secondAmountRadio.value = '50'
  secondAmountRadio.style.marginTop = '15px'

  var secondAmountLabel = document.createElement('label')
  secondAmountLabel.id = 'second-amount-label+' + slug
  secondAmountLabel.className = 'second-amount-label'
  secondAmountLabel.innerText = '€50'
  secondAmountLabel.style.fontSize = '16px'
  secondAmountLabel.style.fontWeight = '700'
  secondAmountLabel.style.marginTop = '12px'
  secondAmountLabel.style.display = 'block'
  secondAmountLabel.onclick = () =>
    this.handleSelectAmount(50, secondAmountLabel.id, '')

  secondAmount.appendChild(secondAmountRadio)
  secondAmount.appendChild(secondAmountLabel)

  amountDiv.appendChild(secondAmount)

  var thirdAmount = document.createElement('div')
  thirdAmount.id = 'third-amount-div' + slug
  thirdAmount.className = 'third-amount-div'
  // thirdAmount.style.height = '45px'
  // thirdAmount.style.width = '60px'
  // thirdAmount.style.borderRadius = '5px'
  // thirdAmount.style.border = '1px black solid'
  // thirdAmount.style.display = 'flex'
  // thirdAmount.style.flexDirection = 'row'

  var thirdAmountRadio = document.createElement('input')
  thirdAmountRadio.setAttribute('type', 'radio')
  thirdAmountRadio.id = 'third-amount' + slug
  thirdAmountRadio.name = 'select-amount' + slug
  thirdAmountRadio.value = '75'
  thirdAmountRadio.style.marginTop = '15px'

  var thirdAmountLable = document.createElement('label')
  thirdAmountLable.id = 'third-amount-label+' + slug
  thirdAmountLable.className = 'third-amount-label'
  thirdAmountLable.innerText = '€75'
  thirdAmountLable.style.fontSize = '16px'
  thirdAmountLable.style.fontWeight = '700'
  thirdAmountLable.style.marginTop = '12px'
  thirdAmountLable.style.display = 'block'
  thirdAmountLable.onclick = () =>
    this.handleSelectAmount(75, thirdAmountLable.id, '')

  thirdAmount.appendChild(thirdAmountRadio)
  thirdAmount.appendChild(thirdAmountLable)

  amountDiv.appendChild(thirdAmount)

  var forthAmount = document.createElement('div')
  forthAmount.id = 'forth-amount-div' + slug
  forthAmount.className = 'forth-amount-div'
  // forthAmount.style.height = '45px'
  // forthAmount.style.width = '60px'
  // forthAmount.style.borderRadius = '5px'
  // forthAmount.style.border = '1px black solid'
  // forthAmount.style.display = 'flex'
  // forthAmount.style.flexDirection = 'row'

  var forthAmountRadio = document.createElement('input')
  forthAmountRadio.setAttribute('type', 'radio')
  forthAmountRadio.id = 'forth-amount' + slug
  forthAmountRadio.name = 'select-amount' + slug
  forthAmountRadio.value = '100'
  forthAmountRadio.style.marginTop = '15px'

  var forthAmountLabel = document.createElement('label')
  forthAmountLabel.id = 'forth-amount-label+' + slug
  forthAmountLabel.className = 'forth-amount-label'
  forthAmountLabel.innerText = '€100'
  forthAmountLabel.style.fontSize = '16px'
  forthAmountLabel.style.fontWeight = '700'
  forthAmountLabel.style.marginTop = '12px'
  forthAmountLabel.style.display = 'block'
  forthAmountLabel.onclick = () =>
    this.handleSelectAmount(100, forthAmountLabel.id, '')

  forthAmount.appendChild(forthAmountRadio)
  forthAmount.appendChild(forthAmountLabel)

  amountDiv.appendChild(forthAmount)

  var otherAmount = document.createElement('div')
  otherAmount.id = 'other-amount-div' + slug
  otherAmount.className = 'other-amount-div'
  // otherAmount.style.height = '45px'
  // otherAmount.style.width = '60px'
  // otherAmount.style.borderRadius = '5px'
  // otherAmount.style.border = '1px black solid'
  // otherAmount.style.display = 'flex'
  // otherAmount.style.flexDirection = 'row'

  var otherAmountRadio = document.createElement('input')
  otherAmountRadio.setAttribute('type', 'radio')
  otherAmountRadio.id = 'other-amount' + slug
  otherAmountRadio.name = 'select-amount' + slug
  otherAmountRadio.value = 'other'
  otherAmountRadio.style.marginTop = '15px'

  var otherAmountLabel = document.createElement('label')
  otherAmountLabel.id = 'other-amount-label+' + slug
  otherAmountLabel.className = 'other-amount-label'
  if (widgetDiv.dataset.lang === 'nl') {
    otherAmountLabel.innerText = 'Bedrag'
  } else if (widgetDiv.dataset.lang === 'de') {
    otherAmountLabel.innerText = 'Andere'
  } else if (widgetDiv.dataset.lang === 'es') {
    otherAmountLabel.innerText = 'Cantidad'
  } else {
    otherAmountLabel.innerText = 'Other'
  }
  otherAmountLabel.style.fontSize = '16px'
  otherAmountLabel.style.fontWeight = '700'
  otherAmountLabel.style.marginTop = '12px'
  otherAmountLabel.style.display = 'block'
  otherAmountLabel.onclick = () =>
    this.handleSelectAmount('other', otherAmountLabel.id, '')
  otherAmount.appendChild(otherAmountRadio)
  otherAmount.appendChild(otherAmountLabel)

  amountDiv.appendChild(otherAmount)

  var otherAmountInputDiv = document.createElement('div')
  otherAmountInputDiv.id = 'other-amount-input-div+' + slug
  otherAmountInputDiv.className = 'other-amount-input-div'

  var otherAmountInput = document.createElement('input')
  otherAmount.setAttribute('type', 'number')
  if (widgetDiv.dataset.lang === 'nl') {
    otherAmountInput.placeholder = 'Ander bedrag'
  } else if (widgetDiv.dataset.lang === 'de') {
    otherAmountInput.placeholder = 'Anderer betrag'
  } else if (widgetDiv.dataset.lang === 'es') {
    otherAmountInput.placeholder = 'Otra cantidad'
  } else {
    otherAmountInput.placeholder = 'Other amount'
  }
  otherAmountInput.id = 'other-amount-input' + slug
  otherAmountInput.style.width = '91%'
  otherAmountInput.value = '€ '
  otherAmountInput.onkeyup = (e) =>
    this.handleOtherAmountInput(e.target.value, otherAmountInput.id)
  otherAmountInputDiv.appendChild(otherAmountInput)
  donationFormDiv.appendChild(otherAmountInputDiv)

  var missingAmountMsg = document.createElement('p')
  missingAmountMsg.id = 'missing-error-msg-amount' + slug
  missingAmountMsg.className = 'missing-error-msg-amount'
  if (widgetDiv.dataset.lang === 'nl') {
    missingAmountMsg.innerText = 'Minimaal €5,-'
  } else if (widgetDiv.dataset.lang === 'de') {
    missingAmountMsg.innerText = 'Mindestens €5,-'
  } else if (widgetDiv.dataset.lang === 'es') {
    missingAmountMsg.innerText = 'Mínimo de €5,-'
  } else {
    missingAmountMsg.innerText = 'Minimum €5,-'
  }
  donationFormDiv.appendChild(missingAmountMsg)

  var donorInfoDiv = document.createElement('div')
  donorInfoDiv.id = 'donor-info-div-modal' + slug
  donorInfoDiv.className = 'donor-info-div-modal'
  donationFormDiv.appendChild(donorInfoDiv)

  var firstNameInput = document.createElement('input')
  firstNameInput.setAttribute('type', 'text')
  if (widgetDiv.dataset.lang === 'nl') {
    firstNameInput.placeholder = 'Voornaam'
  } else if (widgetDiv.dataset.lang === 'de') {
    firstNameInput.placeholder = 'Voornaam'
  } else if (widgetDiv.dataset.lang === 'es') {
    firstNameInput.placeholder = 'Nombre'
  } else {
    firstNameInput.placeholder = 'First name'
  }
  firstNameInput.id = 'first-name-field' + slug
  firstNameInput.className = 'first-name-field'
  donorInfoDiv.appendChild(firstNameInput)

  var missingFirstnameMsg = document.createElement('p')
  missingFirstnameMsg.id = 'missing-error-msg-first-name' + slug
  missingFirstnameMsg.className = 'missing-error-msg'
  if (widgetDiv.dataset.lang === 'nl') {
    missingFirstnameMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
  } else if (widgetDiv.dataset.lang === 'de') {
    missingFirstnameMsg.innerText = 'Muss zwischen 1 und 30 Zeichen lang sein.'
  } else if (widgetDiv.dataset.lang === 'es') {
    missingFirstnameMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
  } else {
    missingFirstnameMsg.innerText = 'Must be between 1 and 30 characters.'
  }
  donorInfoDiv.appendChild(missingFirstnameMsg)

  var lastNameInput = document.createElement('input')
  lastNameInput.setAttribute('type', 'text')
  if (widgetDiv.dataset.lang === 'nl') {
    lastNameInput.placeholder = 'Achternaam'
  } else if (widgetDiv.dataset.lang === 'de') {
    lastNameInput.placeholder = 'Nachname'
  } else if (widgetDiv.dataset.lang === 'es') {
    lastNameInput.placeholder = 'Apellido'
  } else {
    lastNameInput.placeholder = 'Last name'
  }
  lastNameInput.id = 'last-name-field' + slug
  lastNameInput.className = 'last-name-field'
  donorInfoDiv.appendChild(lastNameInput)

  var missingLastnameMsg = document.createElement('p')
  missingLastnameMsg.id = 'missing-error-msg-last-name' + slug
  missingLastnameMsg.className = 'missing-error-msg'
  if (widgetDiv.dataset.lang === 'nl') {
    missingLastnameMsg.innerText = 'Moet tussen de 1 en 30 tekens zijn.'
  } else if (widgetDiv.dataset.lang === 'de') {
    missingLastnameMsg.innerText = 'Muss zwischen 1 und 30 Zeichen lang sein.'
  } else if (widgetDiv.dataset.lang === 'es') {
    missingLastnameMsg.innerText = 'Debe tener entre 1 a 30 caracteres.'
  } else {
    missingLastnameMsg.innerText = 'Must be between 1 and 30 characters.'
  }
  donorInfoDiv.appendChild(missingLastnameMsg)

  var emailInput = document.createElement('input')
  emailInput.setAttribute('type', 'text')
  if (widgetDiv.dataset.lang === 'nl') {
    emailInput.placeholder = 'Emailadres'
  } else if (widgetDiv.dataset.lang === 'de') {
    emailInput.placeholder = 'E-Mail-Adresse'
  } else if (widgetDiv.dataset.lang === 'es') {
    emailInput.placeholder = 'Dirección de email'
  } else {
    emailInput.placeholder = 'Email'
  }
  emailInput.id = 'email-field' + slug
  emailInput.className = 'email-field'
  donorInfoDiv.appendChild(emailInput)

  var missingEmailMsg = document.createElement('p')
  missingEmailMsg.id = 'missing-error-msg-email' + slug
  missingEmailMsg.className = 'missing-error-msg'
  if (widgetDiv.dataset.lang === 'nl') {
    missingEmailMsg.innerText = 'Onjuist emailadres.'
  } else if (widgetDiv.dataset.lang === 'de') {
    missingEmailMsg.innerText = 'Falsche E-Mail-Adresse.'
  } else if (widgetDiv.dataset.lang === 'es') {
    missingEmailMsg.innerText = 'Dirección de E-Mail incorrecta.'
  } else {
    missingEmailMsg.innerText = 'Incorrect email address.'
  }
  donorInfoDiv.appendChild(missingEmailMsg)

  createTipbox(
    donationFormDiv,
    modalContent,
    slug,
    '#2828d6',
    widgetDiv.dataset.lang
  )
  calculateTotalAmount(slug)

  var anonymousDiv=addAnonymousBox(slug, widgetDiv.dataset.lang)
  donationFormDiv.appendChild(anonymousDiv)

  var modalDonateButton = document.createElement('button')
  modalDonateButton.id = 'donate-btn-in-modal+' + slug
  modalDonateButton.className = 'donate-btn-in-form'
  if (widgetDiv.dataset.lang === 'nl') {
    modalDonateButton.innerHTML = '<i class="fa"></i> Doneer'
  } else if (widgetDiv.dataset.lang === 'de') {
    modalDonateButton.innerHTML = '<i class="fa"></i> Spenden'
  } else if (widgetDiv.dataset.lang === 'es') {
    modalDonateButton.innerHTML = '<i class="fa"></i> Donar'
  } else {
    modalDonateButton.innerHTML = '<i class="fa"></i> Donate'
  }
  modalDonateButton.onclick = () =>
    this.directDonate(modalDonateButton.id, widgetDiv.dataset.lang)
  donationFormDiv.appendChild(modalDonateButton)

  var poweredByDiv = document.createElement('div')
  poweredByDiv.id = 'powered-by-div+' + widgetDiv.dataset.slug
  poweredByDiv.className = 'powered-by-div-in-form'
  donationFormDiv.appendChild(poweredByDiv)

  var poweredByLabel = document.createElement('label')
  poweredByLabel.id = 'powered-by-label+' + widgetDiv.dataset.slug
  poweredByLabel.className = 'powered-by-label'
  if (widgetDiv.dataset.lang === 'nl') {
    poweredByLabel.textContent = 'Ondersteund door '
  } else if (widgetDiv.dataset.lang === 'de') {
    poweredByLabel.textContent = 'Angetrieben von '
  } else if (widgetDiv.dataset.lang === 'es') {
  } else {
    poweredByLabel.textContent = 'Powered by '
  }
  poweredByDiv.appendChild(poweredByLabel)

  var whydonateLogo = document.createElement('img')
  whydonateLogo.id = 'whydonate-logo+' + widgetDiv.dataset.slug
  whydonateLogo.className = 'whydonate-logo'
  whydonateLogo.src =
    'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/whydonate-logo-licht.webp'
  if (widgetDiv.dataset.lang === 'nl') {
    whydonateLogo.onclick = () => {
      window.location.href = 'https://www.whydonate.nl/'
    }
  } else {
    whydonateLogo.onclick = () => {
      window.location.href = 'https://www.whydonate.eu/'
    }
  }
  poweredByDiv.appendChild(whydonateLogo)

  document.body.appendChild(modalDiv)
}

function addAnonymousBox(slug, lang) {
  var anonymousDiv=document.createElement('div')
  anonymousDiv.style.display='flex'
  anonymousDiv.style.alignItems='baseline'
  anonymousDiv.style.marginTop='10px'
  anonymousDiv.style.marginLeft='10px'

  var anonymousCheckbox=document.createElement('input')
  anonymousCheckbox.id='donate-anonymous'+slug
  anonymousCheckbox.className='donate-anonymous'
  anonymousCheckbox.type='checkbox'
  anonymousCheckbox.style.width='20px'
  anonymousCheckbox.style.height='20px'
  anonymousDiv.appendChild(anonymousCheckbox)

  var anonymousLabel=document.createElement('label')
  anonymousLabel.id='donate-anonymous-label'+slug
  anonymousLabel.className='donate-anonymous-label'
  anonymousLabel.style.fontSize='16px'
  anonymousLabel.style.marginLeft='5px'

  if (lang==='nl') {
    anonymousLabel.textContent='Anoniem doneren'
  } else if (lang==='de') {
    anonymousLabel.textContent='Anonym spenden'
  } else if (lang==='es') {
    anonymousLabel.textContent='Done anónimamente'
  } else {
    anonymousLabel.textContent='Donate Anonymous'
  }
 
  anonymousDiv.appendChild(anonymousLabel)

  return anonymousDiv
}

function setModalId(f_id, f_slug) {
  var modalFundraiserIdLabel = document.getElementById(
    'fundraiser-id-label' + f_slug
  )
  modalFundraiserIdLabel.innerText = f_id + '+' + f_slug
}

function handleDonate(idValue) {
  var slug = idValue.split('+')[1]
  // Get the modal
  var modal = document.getElementById('myModal' + slug)

  // // Get the button that opens the modal
  // var btn = document.getElementById('myBtn')

  // Get the <span> element that closes the modal
  var span = document.getElementById('close' + slug)

  if (modal.style.display === 'block') {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'flex'
  }

  // // When the user clicks the button, open the modal
  // donateButton.onclick = function() {
  //   modal.style.display = 'block'
  // }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none'
  }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   if (event.target == modal) {
  //     modal.style.display = 'none'
  //   }
  // }
}

function directDonate(idValue, lang) {
  var slugVal = idValue.split('+')[1]

  var fundrasier_id = ''
  var periodIntervals = ''
  var selectedAmount = 25
  var firstName = ''
  var lastName = ''
  var email = ''
  var errorCheck = false

  var amountErrMsg = document.getElementById(
    'missing-error-msg-amount' + slugVal
  )
  var firstNameErrMsg = document.getElementById(
    'missing-error-msg-first-name' + slugVal
  )
  var lastNameErrMsg = document.getElementById(
    'missing-error-msg-last-name' + slugVal
  )
  var emailErrMsg = document.getElementById('missing-error-msg-email' + slugVal)

  amountErrMsg.style.display = 'none'
  firstNameErrMsg.style.display = 'none'
  lastNameErrMsg.style.display = 'none'
  emailErrMsg.style.display = 'none'
  // amountErrMsg.innerText = 'Amount should be minimum €4'

  fundrasier_id = document
    .getElementById('fundraiser-id-label' + slugVal)
    .innerText.split('+')[0]

  if (document.getElementById('onetime' + slugVal).checked) {
    // periodIntervals = document.getElementById('onetime' + slugVal).value
    periodIntervals = 'once'
  } else if (document.getElementById('monthly' + slugVal).checked) {
    // periodIntervals = document.getElementById('monthly' + slugVal).value
    periodIntervals = 'monthly'
  } else {
    // periodIntervals = document.getElementById('yearly' + slugVal).value
    periodIntervals = 'yearly'
  }

  if (document.getElementById('first-amount' + slugVal).checked) {
    selectedAmount = document.getElementById('first-amount' + slugVal).value
  } else if (document.getElementById('second-amount' + slugVal).checked) {
    selectedAmount = document.getElementById('second-amount' + slugVal).value
  } else if (document.getElementById('third-amount' + slugVal).checked) {
    selectedAmount = document.getElementById('third-amount' + slugVal).value
  } else if (document.getElementById('forth-amount' + slugVal).checked) {
    selectedAmount = document.getElementById('forth-amount' + slugVal).value
  } else {
    selectedAmount = parseFloat(
      document
        .getElementById('other-amount-input' + slugVal)
        .value.split('€ ')[1]
        .replace(',', '.')
    )

    if (selectedAmount % 1 !== 0 || isNaN(selectedAmount)) {
      if (lang === 'nl') {
        amountErrMsg.innerText = 'Decimalen zijn niet toegestaan.'
      } else if (lang === 'de') {
        amountErrMsg.innerText = 'Decimale waarden zijn niet toegestaan.'
      } else if (lang === 'es') {
        amountErrMsg.innerText = 'No se permiten valores decimales.'
      } else {
        amountErrMsg.innerText = 'Decimal values are not allowed.'
      }
    }
  }

  firstName = document.getElementById('first-name-field' + slugVal).value
  lastName = document.getElementById('last-name-field' + slugVal).value
  email = document.getElementById('email-field' + slugVal).value

  if (selectedAmount < 5 || isNaN(selectedAmount) || selectedAmount % 1 !== 0) {
    amountErrMsg.style.display = 'block'
    errorCheck = true
  }

  if (firstName === '') {
    firstNameErrMsg.style.display = 'block'
    errorCheck = true
  }

  if (lastName === '') {
    lastNameErrMsg.style.display = 'block'
    errorCheck = true
  }

  if (email === '' || !ValidateEmail(email)) {
    emailErrMsg.style.display = 'block'
    errorCheck = true
  }

  if (errorCheck) {
    // Do nothing
  } else {
    var tipBox=document.getElementById('tip-box'+slugVal)
    var mollie_return_url = ''
    if (window.location!=window.parent.location) {
      if (document.referrer.includes('?d_id=')&&document.referrer.includes('o_id=')) {
        mollie_return_url = document.referrer.split('?d_id')[0]
      }
      else {
        mollie_return_url = document.referrer
      }
    } else {
      if (window.location.href.includes('?d_id=')&&window.location.href.includes('o_id=')) {
        mollie_return_url=window.location.href.split('?d_id')[0]
      }
      else {
        mollie_return_url=window.location.href
      }
    }

    var data = {
      amount: selectedAmount,
      newsletter: false,
      pay_period: periodIntervals,
      fundraising_local_id: fundrasier_id,
      currency_code: 'eur',
      lang: 'en',
      description: '',
      bank_account: '',
      is_anonymous: '',
      tip_amount: tipBox.style.display === 'none' ? 0 : calculateTotalAmount(slugVal),
      return_url: mollie_return_url,
      source: 'script',
    }

    var donorInfo = {
      email: email,
      firstname: firstName,
      lastname: lastName,
      is_anonymous: document.getElementById('donate-anonymous'+slugVal).checked? true:false,
  }

    makeDonation(data, slugVal, lang, donorInfo)
  }
}

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}

async function makeDonation(data, slugVal, lang, donorInfo) {
  const proxyurl = 'https://intense-temple-29395.herokuapp.com/'

  // const donationApi =
  //  'https://whydonate-development.appspot.com/api/v1/donation/order/'

  const donationApi =
     'https://whydonate-production-api.appspot.com/api/v1/donation/order/'

  // const proxyurl = 'http://127.0.0.1:8080/'
  // const donationApi = 'http://127.0.0.1:8000/api/v1/donation/order/'
  const url = proxyurl + donationApi
  localStorage.setItem('latest_fundraiser', slugVal)

  var donateBtnInModal = document.getElementById(
    'donate-btn-in-modal+' + slugVal
  )
  var donateBtn = document.getElementById('donate-btn-in-form+' + slugVal)

  if (donateBtn) {
    if (lang === 'nl') {
      donateBtn.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Doneer'
    } else if (lang === 'de') {
      donateBtn.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Spenden'
    } else if (lang === 'es') {
      donateBtn.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> Donar'
    } else {
      donateBtn.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Donate'
    }
  } else {
    if (lang === 'nl') {
      donateBtnInModal.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Doneer'
    } else if (lang === 'de') {
      donateBtnInModal.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Spenden'
    } else if (lang === 'es') {
      donateBtnInModal.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Donar'
    } else {
      donateBtnInModal.innerHTML =
        '<i class="fa fa-circle-o-notch fa-spin"></i> Donate'
    }
  }
  await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (result) {
      if (donateBtn) {
        if (lang === 'nl') {
          donateBtn.innerHTML = '<i class="fa"></i> Doneer'
        } else if (lang === 'de') {
          donateBtn.innerHTML = '<i class="fa"></i> Spenden'
        } else if (lang === 'es') {
          donateBtn.innerHTML = '<i class="fa"></i> Donar'
        } else {
          donateBtn.innerHTML = '<i class="fa"></i> Donate'
        }
      } else {
        if (lang === 'nl') {
          donateBtnInModal.innerHTML = '<i class="fa"></i> Doneer'
        } else if (lang === 'de') {
          donateBtnInModal.innerHTML = '<i class="fa"></i> Spenden'
        } else if (lang === 'es') {
          donateBtnInModal.innerHTML = '<i class="fa"></i> Donar'
        } else {
          donateBtnInModal.innerHTML = '<i class="fa"></i> Donate'
        }
      }

      localStorage.setItem('donor_info', JSON.stringify(donorInfo))
      var isInIframe = (window.location != window.parent.location)
      if(isInIframe) {
        window.open(result['data']['url'])
      } else {
        window.location.replace(result['data']['url'])
      }

    })
}

function makeUrl() {
  const proxyurl='https://intense-temple-29395.herokuapp.com/'

  // const url =
  //   'https://whydonate-development.appspot.com/api/v1/project/fundraising/local/?slug=' +
  //   widgetDiv.dataset.slug.split('&&&')[0]

   const url =
     'https://whydonate-production-api.appspot.com/api/v1/project/fundraising/local/?slug=' +
       widgetDiv.dataset.slug.split('&')[0]

  // const proxyurl = 'http://127.0.0.1:8080/'
  // const url =
  //   'http://127.0.0.1:8000/api/v1/project/fundraising/local/?slug=' +
  //   widgetDiv.dataset.slug.split('&')[0]

  return proxyurl + url
}

function addJquery() {
  var script = document.createElement('script')
  script.src= 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
  script.type='text/javascript'
  script.onload=function () {
    jQueryTemp=jQuery.noConflict(true);
    jQueryTemp(document).ready(function () {
      jQueryTemp(window).resize(resize)
      resize()
      var urlAddress=window.location.href
      if (urlAddress.includes('&o_id=')) {
        let urlAddressArr = urlAddress.split('&o_id=')
        // console.log('order id ', urlAddressArr[1])

        var donorInfo=localStorage.getItem('donor_info')
        // donorInfo['o_id']=urlAddressArr[1]
        
        donorInfo=JSON.parse(donorInfo)
        donorInfo['o_id']=urlAddressArr[1].split('&client=')[0]

        var actualUrlArr = urlAddress.split('?d_id=')
        window.history.replaceState({}, document.title, actualUrlArr[0])

        // Making api request to check
        var latestFundraiser = localStorage
          .getItem('latest_fundraiser')
          .split('&&&')[0]
        var widgetArrayList = document.getElementsByClassName('widget')
        var widgetWithFormArrayList = document.getElementsByClassName(
          'widget-with-form'
        )

        widgetArrayList = [...widgetArrayList]
        if (widgetWithFormArrayList.length > 0) {
          for (var j = 0; j < widgetWithFormArrayList.length; j++) {
            widgetArrayList.push(widgetWithFormArrayList[j])
          }
        }

        if (widgetArrayList.length > 1) {
          for (var i = 0; i < widgetArrayList.length; i++) {
            if (
              widgetArrayList[i].dataset.slug.split('&&&')[0] ===
              latestFundraiser
            ) {
              var widgetElement = widgetArrayList[i]
              break
            }
          }
        } else {
          var widgetElement = widgetArrayList[0]
        }

        localStorage.setItem('latest_fundraiser', '')
        var success_url = ''
        var fail_url = ''
        if (widgetElement) {
          success_url = widgetElement.dataset.success_url
          fail_url=widgetElement.dataset.fail_url
          // success_url = 'https://www.google.com'
          // fail_url = 'https://www.bing.com'
        }

        var proxyurl = 'https://intense-temple-29395.herokuapp.com/'

        // var api =
        //   'https://whydonate-development.appspot.com/api/v1/donation/order/status/?order_id=' +
        //   urlAddressArr[1]

        var api =
          'https://whydonate-production-api.appspot.com/api/v1/donation/order/status/?order_id=' +
          urlAddressArr[1]

        var url = proxyurl + api

        jQueryTemp.ajax({
          url: url,
          type: 'GET',
          beforeSend: function () {},
          success: function (res) {
            // console.log('order status response ', res)
            if (res['data']['status']==='paid') {
              updateDonorInformation(donorInfo, success_url)
            } else if (res['data']['status']==='canceled') {
              // updateDonorInformation(donorInfo, fail_url)
              if (fail_url !== '') {
                window.location.assign(fail_url)
              }
            } else {
              // do nothing
              if (fail_url !== '') {
                window.location.assign(fail_url)
              }
            }
          },
          error: function (xhr) {
            // console.log('error occured')
          },
          complete: function () {
            // hide loader here
          },
        })
      }
      else {
        if (localStorage.getItem('checkFirstTime') === "true") {
          localStorage.setItem('checkFirstTime', false)
          let domainPart=urlAddress.split('//')
          let domain=domainPart[1].split('/')[0]
          let payload={
            'url': domain,
            'product': 'script'
          }
          checkInstallations(payload)
        }
      }
    })
  }
  document.getElementsByTagName('head')[0].appendChild(script)
}

async function checkInstallations(payload) {
  //Testing api
  // let apiUrl='http://127.0.0.1:8080/http://127.0.0.1:8000/api/v1/account/installations/?client=whydonate_staging'

  let proxyurl='https://intense-temple-29395.herokuapp.com/'
  // let api='https://whydonate-development.appspot.com/api/v1/account/installations/'
  let api='https://whydonate-production-api.appspot.com/api/v1/account/installations/'
  let apiUrl=proxyurl+api

  const settings={
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  }
  const res=await fetch(apiUrl, settings)
  if (res.ok) {
    const json=await res.json()
    // console.log(json)
  } else {
    console.log("Track installations error: "+response.status);
  }
}

async function updateDonorInformation(donorInfo, urlToRedirect) {
  var proxyurl='https://intense-temple-29395.herokuapp.com/'

  // var api=
  //   'https://whydonate-development.appspot.com/api/v1/donation/donor/update/'

  var api =
    'https://whydonate-production-api.appspot.com/api/v1/donation/donor/update/'

  var url=proxyurl+api

  await fetch(url, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(donorInfo),
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (result) {
      // console.log('donor information ', donorInfo)
      localStorage.setItem('donor_info', {})
      setTimeout(function () {
        if (urlToRedirect&&urlToRedirect!=='') {
          window.location.assign(urlToRedirect)
        }
      }, 3000);
    })
}

function resize() {
  if (jQueryTemp(window).width() < 514) {
    jQueryTemp('html').addClass('mobile')

    var widgetWithFormList = document.getElementsByClassName('widget-with-form')

    if (widgetWithFormList) {
      for (var i = 0; i < widgetWithFormList.length; i++) {
        // console.log(widgetWithFormList[i].style.width)
        if (widgetWithFormList[i].style.width === '800px') {
          var donationFormPart = widgetWithFormList[i].firstChild
          var fundraiserInfoPart = widgetWithFormList[i].lastChild

          widgetWithFormList[i].removeChild(donationFormPart)
          widgetWithFormList[i].removeChild(fundraiserInfoPart)

          donationFormPart.style.width = '100%'
          fundraiserInfoPart.style.width = '100%'
          fundraiserInfoPart.style.height = '50%'

          donationFormPart.style.width = 'auto'

          widgetWithFormList[i].style.display = 'flex'
          widgetWithFormList[i].style.flexDirection = 'column'
          widgetWithFormList[i].style.width = '420px'

          widgetWithFormList[i].appendChild(fundraiserInfoPart)
          widgetWithFormList[i].appendChild(donationFormPart)
        }
      }
    }

    var modals = document.getElementsByClassName('modal-content')
    if (modals) {
      for (var j = 0; j < modals.length; j++) {
        modals[j].style.width = '100%'
        modals[j].style.marginLeft = '5px'
        modals[j].style.marginRight = '5px'
      }
    }
  } else {
    var widgetWithFormList = document.getElementsByClassName('widget-with-form')

    if (widgetWithFormList) {
      for (var i = 0; i < widgetWithFormList.length; i++) {
        if (widgetWithFormList[i].style.width === '420px') {
          var fundraiserInfoPart = widgetWithFormList[i].firstChild
          var donationFormPart = widgetWithFormList[i].lastChild

          widgetWithFormList[i].removeChild(donationFormPart)
          widgetWithFormList[i].removeChild(fundraiserInfoPart)

          widgetWithFormList[i].style.display = 'flex'
          widgetWithFormList[i].style.flexDirection = 'row'
          widgetWithFormList[i].style.width = '800px'

          donationFormPart.style.width = '50%'
          fundraiserInfoPart.style.width = '50%'

          widgetWithFormList[i].appendChild(donationFormPart)
          widgetWithFormList[i].appendChild(fundraiserInfoPart)
        } else {
          var fundraiserInfoPart = widgetWithFormList[i].lastChild
          fundraiserInfoPart.style.height = 'auto'
        }
      }
    }

    var modals = document.getElementsByClassName('modal-content')
    if (modals) {
      for (var j = 0; j < modals.length; j++) {
        modals[j].style.width = '450px'
        modals[j].style.margin = 'auto'
      }
    }
    jQueryTemp('html').removeClass('wide')
  }
}

function createTipbox(donationFormDiv, modalContent, slug, color, lang) {
  // if (modalContent) {
  //   modalContent.style.height = '900px'
  // }
  var tipBox = document.createElement('div')
  tipBox.id = 'tip-box' + slug
  tipBox.className = 'tip-box'
  tipBox.style.width = '95%'
  tipBox.style.height = 'auto !important'
  tipBox.style.margin = 'auto'
  tipBox.style.marginTop = '30px'
  tipBox.style.padding = '5px'
  tipBox.style.paddingLeft = '10px'
  // tipBox.style.backgroundColor = lightenColor(color, 75)
  // console.log('lighten color ', lightenColor(color, 40))

  var para1 = document.createElement('p')
  para1.style.fontSize = '15px'
  para1.style.fontWeight = '400'
  para1.style.color = 'black'
  if (lang === 'nl') {
    para1.textContent =
      'Whydonate heeft 0% platformkosten voor organisatoren en we rekenen op de vrijgevigheid van donateurs zoals jij om onze service te garanderen.'
  } else if (lang === 'de') {
  } else if (lang === 'es') {
  } else {
    para1.textContent =
      'Whydonate has a 0% platform fee for organizers and relies on the generosity of donors like you to operate our service.'
  }

  tipBox.appendChild(para1)

  var selectPercentileDiv = document.createElement('div')
  selectPercentileDiv.style.display = 'flex'
  selectPercentileDiv.style.justifyContent = 'space-around'

  var para2 = document.createElement('p')
  para2.style.fontSize = '15px'
  para2.style.fontWeight = '400'
  para2.style.color = 'black'
  para2.style.marginTop = '12px'
  if (lang === 'nl') {
    para2.textContent = 'Bedankt voor het toevoegen van een fooi van : '
  } else if (lang === 'de') {
  } else if (lang === 'es') {
  } else {
    para2.textContent = 'Thank you for including a tip of : '
  }

  selectPercentileDiv.appendChild(para2)

  var dropdown = document.createElement('div')
  dropdown.id = 'custom-select' + slug
  dropdown.className = 'custom-select'
  dropdown.style.width = '150px'
  dropdown.onclick = () => this.handleTipDropdown(slug)

  selectPercentileDiv.appendChild(dropdown)

  var inputTipDiv = document.createElement('div')
  inputTipDiv.id = 'input-tip-div' + slug
  inputTipDiv.style.display = 'none'
  inputTipDiv.style.justifyContent = 'flex-end'
  inputTipDiv.style.marginTop = '10px'

  //  <span class="currencyinput">$<input type="text" name="currency"></span>
  var inputTipSpan = document.createElement('span')

  var inputTipTextBox = document.createElement('input')
  inputTipSpan.innerHTML = '€ ' + inputTipTextBox.outerHTML
  inputTipSpan.innerHTML =
    '€ <input type="text"' +
    'id="input-tip' +
    slug +
    '"' +
    `onkeyup = "calculateTotalAmount('${slug}')"` +
    // slug +
    // ')"' +
    ' name="currency" value="1.00" style="width: 145px !important; height: 25px !important; min-height: 25px !important; border-radius: 3px !important; border-color: transparent !important; font-family: arial !important; font-size: 15px !important; text-align: right !important; line-height: 2em !important; background: white !important"></span>'
  inputTipSpan.style.width = '165px'
  inputTipDiv.appendChild(inputTipSpan)

  tipBox.appendChild(selectPercentileDiv)
  tipBox.appendChild(inputTipDiv)

  var totalChargeDiv = document.createElement('div')
  totalChargeDiv.style.height = '20px'
  totalChargeDiv.style.marginTop = '10px'
  totalChargeDiv.style.textAlign = 'right'

  var totalChargeLabel = document.createElement('label')
  totalChargeLabel.id = 'total-charge-label' + slug
  totalChargeLabel.style.fontSize = '15px'
  totalChargeLabel.innerHTML = 'Total Charge: € '
  totalChargeLabel.style.color = 'black'
  totalChargeLabel.style.marginRight = '15px'
  totalChargeLabel.style.fontWeight = '600'
  totalChargeLabel.style.width = '100%'

  totalChargeDiv.appendChild(totalChargeLabel)
  tipBox.appendChild(totalChargeDiv)

  donationFormDiv.appendChild(tipBox)
  // Reder different options based on selection

  // Check wheather the initial selection is greater than 9
  renderOptionsForPercentile(slug)

  setDropdownFunc(tipBox, slug)
}

function renderOptionsForPercentile(slug) {
  var customSelectDiv = document.getElementById('custom-select' + slug)
  while (customSelectDiv.firstChild) {
    customSelectDiv.removeChild(customSelectDiv.lastChild)
  }

  var selectList = document.createElement('select')
  selectList.id = 'select-dropdown' + slug

  // check which amount is actually selected
  var selectedValue = getSelectedValue(slug)

  var option0 = document.createElement('option')
  option0.text = '15%' + ' (' + (selectedValue * 0.15).toFixed(2) + ') '
  option0.value = (selectedValue * 0.15).toFixed(2)
  selectList.appendChild(option0)

  var option1 = document.createElement('option')
  option1.text = '10%' + ' (' + (selectedValue * 0.1).toFixed(2) + ') '
  option1.value = (selectedValue * 0.1).toFixed(2)
  selectList.appendChild(option1)

  var option2 = document.createElement('option')
  option2.text = '15%' + ' (' + (selectedValue * 0.15).toFixed(2) + ') '
  option2.value = (selectedValue * 0.15).toFixed(2)
  selectList.appendChild(option2)

  var option3 = document.createElement('option')
  option3.text = '20%' + ' (' + (selectedValue * 0.2).toFixed(2) + ') '
  option3.value = (selectedValue * 0.2).toFixed(2)
  selectList.appendChild(option3)

  var option4 = document.createElement('option')
  option4.text = 'Other'
  option4.value = 'Other'
  selectList.appendChild(option4)

  customSelectDiv.appendChild(selectList)
}

function getSelectedValue(slug) {
  // check which amount is actually selected
  var firstRadio = document.getElementById('first-amount' + slug)
  var secondRadio = document.getElementById('second-amount' + slug)
  var thirdRadio = document.getElementById('third-amount' + slug)
  var forthRadio = document.getElementById('forth-amount' + slug)
  var otherRadio = document.getElementById('other-amount' + slug)

  var selectedValue = 0

  if (firstRadio.checked) {
    selectedValue = firstRadio.value
  }
  if (secondRadio.checked) {
    selectedValue = secondRadio.value
  }
  if (thirdRadio.checked) {
    selectedValue = thirdRadio.value
  }
  if (forthRadio.checked) {
    selectedValue = forthRadio.value
  }

  if (forthRadio.checked) {
    selectedValue = forthRadio.value
  }

  if (otherRadio.checked) {
    var otherAmountInputBox = document.getElementById(
      'other-amount-input' + slug
    )
    if (
      otherAmountInputBox.value !== '€ ' &&
      typeof parseFloat(otherAmountInputBox.value.split('€ ')[1]) === 'number'
    ) {
      var amount = otherAmountInputBox.value.split('€ ')[1]
      selectedValue = parseFloat(amount.replace(',', '.'))
    } else {
      selectedValue = 0.0
    }
  }

  return selectedValue
}

function renderOptionsForAmount(slug) {
  var customSelectDiv = document.getElementById('custom-select' + slug)
  while (customSelectDiv.firstChild) {
    customSelectDiv.removeChild(customSelectDiv.lastChild)
  }

  var selectList = document.createElement('select')
  selectList.id = 'select-dropdown' + slug

  var option0 = document.createElement('option')
  option0.text = '€1'
  option0.value = '1'
  selectList.appendChild(option0)

  var option1 = document.createElement('option')
  option1.text = '€1'
  option1.value = '1'
  selectList.appendChild(option1)

  var option2 = document.createElement('option')
  option2.text = '€2'
  option2.value = '2'
  selectList.appendChild(option2)

  var option3 = document.createElement('option')
  option3.text = 'Amount'
  option3.value = '3'
  selectList.appendChild(option3)

  customSelectDiv.appendChild(selectList)
}

function handleOtherAmountInput(value, idValue) {
  var slug = idValue.split('other-amount-input')[1]
  // console.log('Other amount input on change value ', value, slug)
  var otherAmountInputField = document.getElementById(
    'other-amount-input' + slug
  )
  if (!value.includes('€ ')) {
    if (!value.includes('€')) {
      otherAmountInputField.value = '€ ' + value
      value = '€ ' + value
    } else {
      otherAmountInputField.value += ' '
      value += ' '
    }
  }

  if (value.includes('€')) {
    value = value.split('€ ')[1]
  }
  if (value.includes(',')) {
    value = parseFloat(value.replace(',', '.'))
  }
  if (!isNaN(value)) {
    var tipBox = document.getElementById('tip-box' + slug)
    var tipInputDiv = document.getElementById('input-tip-div' + slug)
    tipInputDiv.style.display = 'none'
    if (value <= 9) {
      renderOptionsForAmount(slug)
      setDropdownFunc(tipBox, slug)
    } else {
      renderOptionsForPercentile(slug)
      setDropdownFunc(tipBox, slug)
    }
    calculateTotalAmount(slug)
  } else {
    const editedValue=value.slice(0, -1)
    document.getElementById('other-amount-input'+slug).value='€ '+editedValue
  }
}

function handleTipDropdown(slug) {
  var elm = document.getElementById('custom-select' + slug)
  var selectedValue = document.getElementById('custom-select' + slug)
    .children[1].innerHTML
  // console.log('Selected value ', selectedValue)
  var tipBox = document.getElementById('tip-box' + slug)
  if (selectedValue === 'Other') {
    renderOptionsForAmount(slug)
    setDropdownFunc(tipBox, slug)
  }

  if (selectedValue === 'Amount') {
    var inputTipDiv = document.getElementById('input-tip-div' + slug)
    inputTipDiv.style.display = 'flex'
    var inputTipBox = document.getElementById('input-tip' + slug)

    // check which radio button actually selected
    var firstRadio = document.getElementById('first-amount' + slug)
    var secondRadio = document.getElementById('second-amount' + slug)
    var thirdRadio = document.getElementById('third-amount' + slug)
    var forthRadio = document.getElementById('forth-amount' + slug)
    var otherRadio = document.getElementById('other-amount' + slug)

    if (firstRadio.checked) {
      inputTipBox.value = (firstRadio.value * 0.1).toFixed(2)
    }
    if (secondRadio.checked) {
      inputTipBox.value = (secondRadio.value * 0.1).toFixed(2)
    }
    if (thirdRadio.checked) {
      inputTipBox.value = (thirdRadio.value * 0.1).toFixed(2)
    }
    if (forthRadio.checked) {
      inputTipBox.value = (forthRadio.value * 0.1).toFixed(2)
    }
    if (otherRadio.checked) {
      var otherAmountInputBox = document.getElementById(
        'other-amount-input' + slug
      )
      if (parseInt(otherAmountInputBox.value) > 9) {
        inputTipBox.value = (otherAmountInputBox.value * 0.1).toFixed(2)
        inputTipBox.value = (Math.round(inputTipBox.value * 100) / 100).toFixed(
          2
        )
      } else {
        inputTipBox.value = (Math.round(1 * 100) / 100).toFixed(2)
      }
    }
  }

  if (
    selectedValue !== 'Other' &&
    selectedValue !== 'Amount' &&
    !selectedValue.includes('€')
  ) {
    var selectedAmount = getSelectedValue(slug)

    // if (tipBoxSlugList.current === '') {
    //   tipBoxSlugList.current = selectedAmount
    //   renderOptionsForPercentile(slug)
    //   setDropdownFunc(tipBox, slug)
    // } else {
    //   if (tipBoxSlugList.current !== selectedAmount) {
    //     tipBoxSlugList.current = selectedAmount
    //     renderOptionsForPercentile(slug)
    //     setDropdownFunc(tipBox, slug)
    //   }
    // }

    // if (Object.keys(whydonateSlugs[`${slug}`]).length === 0) {
    //   // whydonateSlugs[`${slug}`] = {}
    //   whydonateSlugs[`${slug}`].current = selectedAmount
    //   // renderOptionsForPercentile(slug)
    //   // setDropdownFunc(tipBox, slug)
    // } else {
    //   if (whydonateSlugs[`${slug}`].current !== selectedAmount) {
    //     whydonateSlugs[`${slug}`].current = selectedAmount
    //     renderOptionsForPercentile(slug)
    //     setDropdownFunc(tipBox, slug)
    //   }
    // }

    if (!whydonateSlugs.hasOwnProperty(slug)) {
      whydonateSlugs[`${slug}`] = {}
      whydonateSlugs[`${slug}`].current = selectedAmount
      renderOptionsForPercentile(slug)
      setDropdownFunc(tipBox, slug)
    } else {
      if (
        whydonateSlugs[`${slug}`].current !== selectedAmount &&
        whydonateSlugs[`${slug}`].current !== 0
      ) {
        whydonateSlugs[`${slug}`].current = selectedAmount
        renderOptionsForPercentile(slug)
        setDropdownFunc(tipBox, slug)
      }
    }
  }

  calculateTotalAmount(slug)
}

function lightenColor(color, percent) {
  var num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

function setDropdownFunc(tipBox, slug) {
  var x, i, j, selElmnt, a, b, c
  /* Look for any elements with the class "custom-select": */
  x = tipBox.getElementsByClassName('custom-select')
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0]
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement('DIV')
    a.setAttribute('class', 'select-selected')
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML
    x[i].appendChild(a)
    // this.handleSelect(tipBox, slug, a)
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement('DIV')
    b.setAttribute('class', 'select-items select-hide')
    for (j = 1; j < selElmnt.length; j++) {
      /* For each option in the original select element,
          create a new DIV that will act as an option item: */
      c = document.createElement('DIV')
      c.innerHTML = selElmnt.options[j].innerHTML
      c.addEventListener('click', function (e) {
        /* When an item is clicked, update the original select box,
            and the selected item: */
        var y, i, k, s, h
        s = this.parentNode.parentNode.getElementsByTagName('select')[0]
        h = this.parentNode.previousSibling
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML === this.innerHTML) {
            s.selectedIndex = i
            h.innerHTML = this.innerHTML
            y = this.parentNode.getElementsByClassName('same-as-selected')
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute('class')
            }
            this.setAttribute('class', 'same-as-selected')
            break
          }
        }
        h.click()
      })
      b.appendChild(c)
    }
    x[i].appendChild(b)
    a.addEventListener('click', function (e) {
      /* When the select box is clicked, close any other select boxes,
          and open/close the current select box: */
      e.stopPropagation()
      closeAllSelect(this)
      this.nextSibling.classList.toggle('select-hide')
      this.classList.toggle('select-arrow-active')
    })
  }
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    arrNo = []
  x = document.getElementsByClassName('select-items')
  y = document.getElementsByClassName('select-selected')
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove('select-arrow-active')
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add('select-hide')
    }
  }
}

function calculateTotalAmount(slug) {
  var selectedAmount = getSelectedValue(slug)
  var customSelect = document.getElementById('custom-select' + slug)
  var selectItem = customSelect.children[1].innerHTML
  var tipAmount = ''
  var inputTipboxDiv = document.getElementById('input-tip-div' + slug)

  if (inputTipboxDiv.style.display === 'flex') {
    tipAmount = document.getElementById('input-tip' + slug).value
  } else {
    if (selectItem.includes('€')) {
      tipAmount = selectItem.substring(1)
    } else {
      tipAmount = selectItem.split('(')[1].split(')')[0]
    }
  }

  selectedAmount=Number(parseFloat(selectedAmount).toFixed(2))
  if (isNaN(tipAmount)) {
    const editedValue=tipAmount.slice(0, -1)
    document.getElementById('input-tip'+slug).value=editedValue
    return
  }

  if (tipAmount !== '') {
    tipAmount = Number(parseFloat(tipAmount.replace(',', '.')).toFixed(2))
  } else {
    tipAmount = 0.0
    document.getElementById('input-tip' + slug).value = 0.0
  }

  if (selectedAmount === 0) {
    tipAmount = 0.0
  }
  var totalAmount = selectedAmount + tipAmount
  var tipLabel = document.getElementById('total-charge-label' + slug)
  totalAmount = (Math.round(totalAmount * 100) / 100).toFixed(2)
  tipLabel.innerHTML = ''
  tipLabel.innerHTML = 'Total Charge: € ' + totalAmount
  // console.log('Actual donation ', selectedAmount)
  // console.log('Tip amount ', tipAmount)
  // console.log('Total amount ', totalAmount)
  return tipAmount
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener('click', closeAllSelect)
