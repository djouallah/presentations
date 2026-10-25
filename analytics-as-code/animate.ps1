param([string]$Deck)
# Adds the click animations build.js marked: a shape named a<k>_... fades in on click k of its slide
# (with the other shapes of the same k), a<k>p_... one paragraph per click. Every slide fades in.
$FADE = 10            # msoAnimEffectFade
$ON_CLICK = 1         # msoAnimTriggerOnPageClick
$WITH_PREVIOUS = 2    # msoAnimTriggerWithPrevious
$BY_PARAGRAPH = 2     # msoAnimateTextByFirstLevel
$app = New-Object -ComObject PowerPoint.Application
try {
  $pres = $app.Presentations.Open($Deck, $false, $false, $false)
  $total = 0
  foreach ($s in $pres.Slides) {
    $s.SlideShowTransition.EntryEffect = 3849   # ppEffectFadeSmoothly
    $s.SlideShowTransition.Duration = 0.4
    $marked = @()
    $z = 0
    foreach ($sh in $s.Shapes) {
      $z++
      if ($sh.Name -match '^a(\d+)(p?)_') { $marked += [pscustomobject]@{ Shape = $sh; Step = [int]$Matches[1]; Para = ($Matches[2] -eq 'p'); Z = $z } }
    }
    $prev = -1
    foreach ($m in ($marked | Sort-Object Step, Z)) {
      if ($m.Para) {
        $null = $s.TimeLine.MainSequence.AddEffect($m.Shape, $FADE, $BY_PARAGRAPH, $ON_CLICK)
      } else {
        $trigger = if ($m.Step -ne $prev) { $ON_CLICK } else { $WITH_PREVIOUS }
        $null = $s.TimeLine.MainSequence.AddEffect($m.Shape, $FADE, 0, $trigger)
      }
      $prev = $m.Step
      $total++
    }
  }
  $pres.Save(); $pres.Close()
  "animated $total shapes"
} finally { $app.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null }
