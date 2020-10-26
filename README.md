# A JAVASCRIPT PLUGIN FOR COLLECTING DONATION

This is a simple script which will work on any website. I've made this script for [Whydonate](https://www.whydonate.nl) users. Whoever use **Whydonate Platform** can also use this script

## Instructions on how to use:

-   Copy the slug of the fundraiser. For example, if this is the link of your `https://www.whydonate.nl/fundraising/xr-nl-septemberrebellie` fundraiser then the slug would be `fundraising/xr-nl-septemberrebellie`
-   Then generate the embed code. You can either create it from the [Whydonate](https://www.whydonate.nl) or you can paste it like this

    ` <div style="margin-top: 100px;"> <div id="xr-nl-septemberrebellie" class="widget" value="donation-form+image" data-slug="xr-nl-septemberrebellie" data-lang="en" data-card="show" data-success_url="https://www.google.com" data-fail_url="https://www.bing.com"></div> <script src="https://res.cloudinary.com/dxhaja5tz/raw/upload/script_main.js" type="text/javascript"></script> </div>`

    Just make sure the **id** and **data-slug** property is same as the **slug** value. You can change rest of the options. To change the **language** property you've to change **data-lang** property value. Right now we have **en**, **de**, **nl** and **es** options available for this property. You can also change the style property. For this you've to change **value** property. You can change it to these _donation-form+image_, **donation-widget**, **show-with-image**, **donation-form+widget** properties. It'll appear in different different styles for each property. Play around with it 😊. Also you can change success and failure url for donation. If the donation is successful it'll return back to success-url otherwise it'll go to fail-url. For this you need to change **data-success_url** and **data-fail_url** according to this.

-   Paste this code to your website. That's it!
-   Voila! Your donation widget appears.

## Samples

Here is a [Link](https://whydonate.jouwweb.nl/) where you can check some samples of this plugin.

**Cheers!🍺**
