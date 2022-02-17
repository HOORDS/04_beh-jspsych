/**
 * jspsych-frame-rate
 * Albert Louis Philippe
 *
 * Plugin for calculating the frame rate of the display of the computer.
 **/

jsPsych.plugins['frame-rate'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'frame-rate',
        description: '',
        parameters: {
            frame_count: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Frame count',
                default: 60,
                description: 'How many frames will be used to calculate the frame rate.'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        // store response
        var infos = {
            frame_rate: null
        };

        var new_html = '<div id="jspsych-computer-info">Retrieving FPS... ' + '(0%)' + '</div>';

        // draw
        display_element.innerHTML = new_html;

        // function to end trial when it is time
        var end_trial = function() {

          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

          // gather the data to store for the trial
          var trial_data = {
            frame_rate: infos.frame_rate
          };

          // clear the display
          display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        };

        // function to calculate the display frame rate
        function calc_frame_rate(in_frame_count){
            var requestFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame;
            if (!requestFrame) {
                // if cannot calculate the frame rate -> set frame_rate value to -1
                infos.frame_rate = -1;
                end_trial();
            }
            else {
                function checker(){
                    if (index--) {
                        requestFrame(checker);
                        display_element.innerHTML = '<div id="jspsych-computer-info">Retrieving FPS... ' + '(' + Math.round(100*(count-index)/count) + '%)' + '</div>';
                    }
                    else {
                        var frame_rate = Math.round(count*1000/(performance.now()- start) * 100)/100;
                        infos.frame_rate = frame_rate;
                        end_trial();
                    }
                }

                var count = in_frame_count, index = count, start = performance.now();
                checker();
            }
        }

        calc_frame_rate(trial.frame_count);
    };

    return plugin;
})();