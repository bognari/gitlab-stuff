$(document).ready(function () {

  var rootURL = window.location.protocol + '//' + window.location.hostname + '/'
  var rootOwner = 'root'
  var projectReg = new RegExp(escapeRegExp(rootURL + rootOwner) + '\/([^/]*)(\/)?.*')
  var count = 0

  if (projectReg.test(document.URL)) {
    var found = document.URL.match(projectReg)
    var project = found[1]
    $('<div id="errorlog" class="container-fluid container-limited project-last-commit"></div>').insertAfter('.content')
    showLog(project)
  }

  //var colorReg = /(\[0K)|(\[\d+;\d?m)/gu
  var colorReg = /\x1b\[[0-9;]*m/gu
  var compilerErrorReg = /(\$ javac \*\.java\n)(((?!Running after script\.\.\.|\$ find \-type f -name).|\n)+)/
  var compilerCleanReg = /\n\d+ errors?/g
  var checkstyleErrorReg = /(Starting audit\.\.\.\n)((.|\n)*)(\nAudit done\.)/
  var checkstyleStartStopReg = /((Starting audit\.\.\.)|(Audit done\.)|(Checkstyle ends with \d+ errors?\.))\n?/g
  var loadedBuildNR = ''

  function escapeRegExp (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  }

  function getErrors (data) {
    data = data.replace(colorReg, '')
    var errors = ''
    if (compilerErrorReg.test(data)) {
      errors = data.match(compilerErrorReg)[2]
      errors = errors.replace(compilerCleanReg, '')
      console.log(errors);
    } else if (checkstyleErrorReg.test((data))) {
      errors = data.match(checkstyleErrorReg)[0]
      errors = errors.replace(checkstyleStartStopReg, '')
    }
    return errors
  }

  function insertInLog (errors, project) {
    var headline = '<div class="project-home-panel text-center"><h3 class="page-title">Log Buildnumber ' + loadedBuildNR +
      ' <a href="' + rootURL + rootOwner + '/' + project + '/commits/master">' +
      '<img alt="build status" src="' + rootURL + rootOwner + '/' + project + '/badges/master/build.svg" /></a></h3></div>'
    var log = '<pre class="build-trace" id="build-log"><code class="bash js-build-output">' + errors + '</code></pre>'
    $('#errorlog').html(headline + log)
    setTimeout(showLog, 15000, project)
  }

  function showLog (project) {
    var buildNrsReg = new RegExp('((ci-failed)|(ci-success))' + escapeRegExp('" href="/' + rootOwner + '/' + project + '/builds/') + '(\\\d*)')
    $.get(rootURL + rootOwner + '/' + project + '/builds').done(function (data) {
      var bildNrResult = data.match(buildNrsReg)
      if (bildNrResult != null) {
        var last = bildNrResult[4]
        if (loadedBuildNR != last) {
          loadedBuildNR = last
          $.get(rootURL + rootOwner + '/' + project + '/builds/' + last + '/raw', function (data) {
            insertInLog(getErrors(data), project)
          })
        } else {
          setTimeout(showLog, 15000, project)
        }
      } else {
        setTimeout(showLog, 15000, project)
      }
    })

  }
})