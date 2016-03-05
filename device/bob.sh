pkill -f node
pkill -f python

export DISPLAY=:0.0;
node run.broker.js &
node run.midori.js &
node run.signals.js &
node run.app.js &

