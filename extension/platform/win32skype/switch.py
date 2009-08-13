# from Jambu - http://www.oatsoft.org/trac/jambu/browser/trunk/src/lib/jambu/Switch.py

import pygame
from pygame.event import poll

NO_EVENT, SWITCH_DOWN, SWITCH_UP = range(3)

_EVENTS = (pygame.JOYBUTTONUP, pygame.JOYBUTTONDOWN)

def init():
  pygame.display.init() # not sure why but we get video errors otherwise.
  pygame.joystick.init()

  # only events we want
  events_to_block = range(pygame.NOEVENT+1, pygame.NUMEVENTS-1)
  pygame.event.set_blocked(events_to_block)
  pygame.event.set_allowed(_EVENTS)
  njoy = pygame.joystick.get_count()
  #print '%d joysticks found' % njoy
  if njoy:
    js = pygame.joystick.Joystick(njoy - 1)
    js.init()

def getEvent():
  event = poll()
  #print pygame.event.event_name(event.type)
  if event.type == pygame.NOEVENT:
    return (NO_EVENT, 0, 0)
  elif event.type == pygame.JOYBUTTONDOWN: 
    return (SWITCH_DOWN, event.joy, event.button)
  elif event.type == pygame.JOYBUTTONUP: 
    return (SWITCH_UP, event.joy, event.button)
