#!/bin/sh

set -e

app_envs='
$VUE_APP_PUBLIC_PATH
$VUE_APP_GTM
$VUE_APP_DEMO_BEHAVIOUR
$VUE_APP_WEBTRIT_APP_NAME
$VUE_APP_WEBTRIT_APP_SUBNAME
$VUE_APP_WEBTRIT_COMPANY_NAME
$VUE_APP_WEBTRIT_COMPANY_URL
$VUE_APP_WEBTRIT_COMPANY_LOGO_IMG_SRC
$VUE_APP_WEBTRIT_CORE_URL
$VUE_APP_WEBTRIT_NAVIGATION_DRAWER_MINIMIZING
$VUE_APP_COLOR_PRIMARY
$VUE_APP_COLOR_SECONDARY
$VUE_APP_COLOR_ACCENT
$VUE_APP_COLOR_SURFACE
$VUE_APP_COLOR_ERROR
$VUE_APP_COLOR_INFO
$VUE_APP_COLOR_SUCCESS
$VUE_APP_COLOR_WARNING
$VUE_APP_COLOR_ANCHOR
'

app_dir='/usr/share/nginx/html'
find "$app_dir" -follow -type f \( -name "index.*.js" -o -name "*.html" \) -print | while read -r orig_f; do
  temp_f=$(mktemp -u)
  envsubst "$app_envs" <$orig_f >$temp_f
  cp $temp_f $orig_f
  rm $temp_f
done

exit 0
