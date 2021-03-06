require 'rake/clean'

$LOAD_PATH.unshift File.dirname(__FILE__) + "/lib"
require 'webfontloader'

#
# Setup
#

# Build targets (remove with `rake clean`)
CLEAN.include("target")
CLEAN.include("tmp")

# JsTestDriver
JsTestPort = "9876"
JsTestServer = "http://localhost:#{JsTestPort}"
JsTestJar = "tools/jstestdriver/JsTestDriver-1.2.1.jar"

# JsCompiler
JsCompilerJar = "tools/compiler/compiler.jar"

# JS Source dependencies
AllJs = FileList["{src,src-test}/**/*"]
SourceJs  = FileList["src/**/*"]

# JS Source loader
@modules = WebFontLoader::Modules.new

#
# Build
#

directory "target"
directory "tmp"

file "tmp/jsTestDriver.conf" => AllJs + ["tmp"] do |t|
  require 'yaml'
  config = {
    "server" => JsTestServer,
    "load" => (@modules.all_source_files + @modules.all_test_globs).map { |f| "../#{f}" }
  }
  File.open(t.name, "w") { |f| YAML.dump(config, f) }
end

desc "Compile the JavaScript into target/webfont.js"
task :compile => "target/webfont.js"

file "target/webfont.js" => SourceJs + ["target"] do |t|

  output_marker = "%output%"
  output_wrapper = @modules.js_output_wrapper(output_marker)

  args = [
    ["-jar", JsCompilerJar],
    ["--compilation_level", "ADVANCED_OPTIMIZATIONS"],
    ["--js_output_file", t.name],
    ["--output_wrapper_marker", %("#{output_marker}")],
    ["--output_wrapper", %("#{output_wrapper}")]
  ]

  source = @modules.all_source_files
  args.concat source.map { |f| ["--js", f] }

  system "java #{args.flatten.join(' ')}"
end

desc "Creates debug version into target/webfont.js"
task :debug => "target/webfont_debug.js"

file "target/webfont_debug.js" => SourceJs + ["target"] do |t|
  File.open(t.name, "w") { |f|
    @modules.all_source_files.each { |src|
      f.puts File.read(src)
      f.puts ""
    }
  }
end

#
# Run
#

namespace :test do
  task :server do
    system "java -jar #{JsTestJar} --port #{JsTestPort}"
  end
  task :capture do
    system "open #{JsTestServer}/capture?strict"
  end
  desc "Boot the test server and capture a browser"
  multitask :boot => ['test:server', 'test:capture']
end

desc "Run all tests"
task :test => ["tmp/jsTestDriver.conf"] do |t|
  config = t.prerequisites.first
  system "java -jar #{JsTestJar} --config #{config} --server #{JsTestServer} --tests all --captureConsole --verbose"
end

desc "Start the demo server"
task :demo => "target/webfont.js" do |t|
  js = t.prerequisites.first
  exec "bin/webfontloader-demos -F --compiled_js #{js}"
end

desc "Start the demo server for development"
task :demodev do
  exec "bin/webfontloader-demos -F -L --modules"
end

desc "Find out how many bytes the source is"
task :bytes => "target/webfont.js" do |t|
  js = t.prerequisites.first
  bytes = File.read(js).size
  puts "#{bytes} bytes uncompressed"
end

desc "Find out how many bytes the source is when gzipped"
task :gzipbytes => "target/webfont.js" do |t|
  require 'zlib'
  js = t.prerequisites.first
  bytes = Zlib::Deflate.deflate(File.read(js)).size
  puts "#{bytes} bytes gzipped"
end

#
# Release
#

def name
  @name ||= "webfontloader"
end

def version
  line = File.read("lib/#{name}.rb")[/^\s*VERSION\s*=\s*.*/]
  line.match(/.*VERSION\s*=\s*['"](.*)['"]/)[1]
end

task :release do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to release!"
    exit!
  end
  sh "git commit --allow-empty -a -m 'Release #{version}'"
  sh "git tag -a v#{version}"
  sh "git push origin master --tags"
end
