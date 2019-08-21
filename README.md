# fitbit-converter
Simple currency converter for Fitbit Ionic, Versa, and Versa Lite

This app converts currency values using the latest published exchange rates
from the European Central Bank. It uses the public ECB exchange rates API
(https://exchangeratesapi.io) to query the latest exchange rates.
The rates are polled at each invocation.

This app requires permission to access the internet (the
``access_internet`` permission) in order to load the latest rates live.
